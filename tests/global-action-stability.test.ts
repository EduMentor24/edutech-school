import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const quizScreen = readFileSync("app/quiz/[quizId].tsx", "utf8");
const coefficientScreen = readFileSync("app/administration/coefficients.tsx", "utf8");
const notificationProvider = readFileSync("lib/notifications/notification-sync-context.tsx", "utf8");

describe("stabilité des actions globales", () => {
  it("mémorise le contexte du détail Quiz hors des états d’action", () => {
    expect(quizScreen).toContain("const cacheContext = useMemo");
    expect(quizScreen).toContain("[profileId, schoolLevel, profileSeries, profileRole]");
    expect(quizScreen).toContain("}, [cacheContext, quizId]);");
    expect(quizScreen).not.toContain("const cacheContext = pedagogicalCacheContextFromProfile(profile);");
    expect(quizScreen).not.toContain("[cacheContext, quizId, saving]");
  });

  it("ne fait pas dépendre le chargement des coefficients d’un objet sélectionné", () => {
    expect(coefficientScreen).toContain("setSelected((current) =>");
    expect(coefficientScreen).toContain("}, []); useFocusEffect");
    expect(coefficientScreen).not.toContain("}, [selected]); useFocusEffect");
  });

  it("ne recrée pas le rafraîchissement des notifications sur la longueur de sa propre boîte", () => {
    expect(notificationProvider).toContain("const inboxRef = useRef(inbox);");
    expect(notificationProvider).toContain("inboxRef.current.items.length");
    expect(notificationProvider).toContain("}, [isOffline, profile, user]);");
    expect(notificationProvider).not.toContain("[inbox.items.length, isOffline, profile, user]");
  });
});
