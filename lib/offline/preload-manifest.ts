import {
  readPedagogicalCache,
  writePedagogicalCache,
  type PedagogicalCacheContext,
} from "./pedagogical-cache";

export const PRELOAD_DOMAINS = [
  "courses",
  "exercises",
  "quizzes",
  "citations",
  "progression",
] as const;
export type PreloadDomain = (typeof PRELOAD_DOMAINS)[number];
export type PreloadDomainState = "idle" | "syncing" | "interrupted" | "partial" | "ready" | "error";
export type PreloadResourceState = "pending" | "synced" | "error";
export type PreloadResourcePlan = { id: string; version?: string | null };
export type PreloadResourceManifest = {
  id: string;
  version: string | null;
  state: PreloadResourceState;
  attempts: number;
  updatedAt: string;
  error: string | null;
};
export type PreloadDomainManifest = {
  schemaVersion: 1;
  domain: PreloadDomain;
  context: Pick<PedagogicalCacheContext, "userId" | "schoolLevel" | "series" | "role">;
  state: PreloadDomainState;
  targetVersion: string | null;
  expectedCount: number;
  downloadedCount: number;
  succeededCount: number;
  lastResourceId: string | null;
  lastSyncAt: string | null;
  lastAttemptAt: string | null;
  error: string | null;
  resources: Record<string, PreloadResourceManifest>;
};
export type PreloadManifestSummary = {
  state: PreloadDomainState;
  expectedCount: number;
  downloadedCount: number;
  succeededCount: number;
  errorCount: number;
  lastSyncAt: string | null;
  error: string | null;
};

const resourceKey = (domain: PreloadDomain) => `preload/manifest/v1/${domain}`;
export const MANIFEST_STALE_AFTER_MS = 6 * 60 * 60 * 1000;
const timestamp = () => new Date().toISOString();
const errorMessage = (cause: unknown) => cause instanceof Error ? cause.message : "La synchronisation est temporairement indisponible.";

export function preloadFingerprint(value: unknown) {
  const text = JSON.stringify(value);
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1)
    hash = ((hash << 5) + hash) ^ text.charCodeAt(index);
  return `manifest-v1-${(hash >>> 0).toString(36)}`;
}

function scopedContext(context: PedagogicalCacheContext) {
  return { userId: context.userId, schoolLevel: context.schoolLevel, series: context.series, role: context.role };
}
function count(resources: Record<string, PreloadResourceManifest>) {
  const values = Object.values(resources);
  const succeededCount = values.filter((item) => item.state === "synced").length;
  return { expectedCount: values.length, downloadedCount: succeededCount, succeededCount, errorCount: values.filter((item) => item.state === "error").length };
}
function stateOf(resources: Record<string, PreloadResourceManifest>, state: PreloadDomainState) {
  const summary = count(resources);
  if (!summary.expectedCount || summary.succeededCount === summary.expectedCount) return "ready" as const;
  if (state === "interrupted") return "interrupted" as const;
  if (summary.errorCount) return summary.succeededCount ? "partial" as const : "error" as const;
  return summary.succeededCount ? "partial" as const : "idle" as const;
}
function compatible(manifest: PreloadDomainManifest, context: PedagogicalCacheContext, domain: PreloadDomain) {
  const identity = scopedContext(context);
  return manifest.schemaVersion === 1 && manifest.domain === domain && Object.entries(identity).every(([key, value]) => manifest.context[key as keyof typeof identity] === value);
}

async function save(context: PedagogicalCacheContext, manifest: PreloadDomainManifest) {
  const summary = count(manifest.resources);
  const next: PreloadDomainManifest = { ...manifest, ...summary, state: stateOf(manifest.resources, manifest.state) };
  await writePedagogicalCache(context, resourceKey(next.domain), next);
  return next;
}

export async function readPreloadManifest(context: PedagogicalCacheContext, domain: PreloadDomain) {
  const cached = await readPedagogicalCache<PreloadDomainManifest>(context, resourceKey(domain));
  return cached && compatible(cached.payload, context, domain) ? cached.payload : null;
}

export async function preparePreloadManifest(context: PedagogicalCacheContext, domain: PreloadDomain, plan: readonly PreloadResourcePlan[], targetVersion: string | null, forcePending = false) {
  const previous = await readPreloadManifest(context, domain);
  const at = timestamp();
  const planned = new Map(plan.filter((item) => item.id.trim()).map((item) => [item.id, item.version ?? null]));
  const resources: Record<string, PreloadResourceManifest> = {};
  planned.forEach((version, id) => {
    const existing = previous?.resources[id];
    const changed = Boolean(existing && version && existing.version && version !== existing.version);
    const retain = existing?.state === "synced" && !changed && !forcePending;
    resources[id] = retain ? { ...existing, version: version ?? existing.version } : { id, version: version ?? existing?.version ?? null, state: "pending", attempts: existing?.attempts ?? 0, updatedAt: existing?.updatedAt ?? at, error: null };
  });
  if (previous) {
    Object.entries(previous.resources).forEach(([id, resource]) => {
      if (!resources[id]) resources[id] = forcePending && resource.state === "synced" ? { ...resource, state: "pending", error: null } : resource;
    });
  }
  return save(context, { schemaVersion: 1, domain, context: scopedContext(context), state: "syncing", targetVersion, expectedCount: 0, downloadedCount: 0, succeededCount: 0, lastResourceId: previous?.lastResourceId ?? null, lastSyncAt: previous?.lastSyncAt ?? null, lastAttemptAt: at, error: null, resources });
}

/** Ajoute un lot de ressources découvertes sans annuler les succès déjà synchronisés. */
export async function mergePreloadResources(context: PedagogicalCacheContext, domain: PreloadDomain, plan: readonly PreloadResourcePlan[], targetVersion: string | null) {
  const manifest = await readPreloadManifest(context, domain);
  if (!manifest) return preparePreloadManifest(context, domain, plan, targetVersion);
  const at = timestamp();
  const resources = { ...manifest.resources };
  plan.filter((item) => item.id.trim()).forEach((planned) => {
    const current = resources[planned.id];
    const changed = Boolean(current && planned.version && current.version && planned.version !== current.version);
    resources[planned.id] = !current || changed
      ? { id: planned.id, version: planned.version ?? current?.version ?? null, state: "pending", attempts: current?.attempts ?? 0, updatedAt: current?.updatedAt ?? at, error: null }
      : { ...current, version: planned.version ?? current.version };
  });
  return save(context, { ...manifest, state: "syncing", targetVersion, lastAttemptAt: at, error: null, resources });
}

export async function markPreloadResourceSynced(context: PedagogicalCacheContext, domain: PreloadDomain, resourceId: string, version: string | null = null) {
  const manifest = await readPreloadManifest(context, domain);
  const resource = manifest?.resources[resourceId];
  if (!manifest || !resource) return manifest;
  const at = timestamp();
  return save(context, { ...manifest, state: "syncing", error: null, lastResourceId: resourceId, lastAttemptAt: at, resources: { ...manifest.resources, [resourceId]: { ...resource, version: version ?? resource.version, state: "synced", attempts: resource.attempts + 1, updatedAt: at, error: null } } });
}

export async function markPreloadResourceError(context: PedagogicalCacheContext, domain: PreloadDomain, resourceId: string, cause: unknown) {
  const manifest = await readPreloadManifest(context, domain);
  const resource = manifest?.resources[resourceId];
  if (!manifest || !resource) return manifest;
  const at = timestamp();
  const error = errorMessage(cause);
  return save(context, { ...manifest, state: "partial", error, lastResourceId: resourceId, lastAttemptAt: at, resources: { ...manifest.resources, [resourceId]: { ...resource, state: "error", attempts: resource.attempts + 1, updatedAt: at, error } } });
}

export async function markPreloadDomainInterrupted(context: PedagogicalCacheContext, domain: PreloadDomain, cause?: unknown) {
  const manifest = await readPreloadManifest(context, domain);
  if (!manifest) return null;
  return save(context, { ...manifest, state: "interrupted", lastAttemptAt: timestamp(), error: cause ? errorMessage(cause) : manifest.error });
}

export async function finishPreloadDomain(context: PedagogicalCacheContext, domain: PreloadDomain) {
  const manifest = await readPreloadManifest(context, domain);
  if (!manifest) return null;
  const at = timestamp();
  return save(context, { ...manifest, lastSyncAt: at, lastAttemptAt: at, error: null });
}

export function missingPreloadResources(manifest: PreloadDomainManifest | null | undefined) {
  return manifest ? Object.values(manifest.resources).filter((resource) => resource.state !== "synced").map((resource) => resource.id) : [];
}

export function preloadManifestSummary(manifest: PreloadDomainManifest | null | undefined): PreloadManifestSummary {
  if (!manifest) return { state: "idle", expectedCount: 0, downloadedCount: 0, succeededCount: 0, errorCount: 0, lastSyncAt: null, error: null };
  return { state: stateOf(manifest.resources, manifest.state), ...count(manifest.resources), lastSyncAt: manifest.lastSyncAt, error: manifest.error };
}

export function isPreloadManifestFresh(manifest: PreloadDomainManifest | null | undefined, at = Date.now()) {
  return Boolean(manifest?.state === "ready" && manifest.lastSyncAt && at - new Date(manifest.lastSyncAt).getTime() < MANIFEST_STALE_AFTER_MS);
}
