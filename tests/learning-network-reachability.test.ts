import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const manager = readFileSync("lib/offline/learning-sync-manager.ts", "utf8");
const context = readFileSync("lib/offline/learning-sync-context.tsx", "utf8");

describe("synchronisation de progression Android", () => {
  it("ne traite pas un état de portée inconnu comme hors ligne lorsque le réseau est connecté", () => {
    expect(manager).toContain(
      "state.isConnected === true && state.isInternetReachable !== false",
    );
    expect(context).toContain(
      "network.isConnected === true && network.isInternetReachable !== false",
    );
  });
});
