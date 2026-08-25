import { describe, expect, it } from "vitest";

const expoToken = process.env.EXPO_TOKEN;
const authenticatedIt = expoToken ? it : it.skip;

describe("authentification EAS", () => {
  authenticatedIt(
    "valide le jeton Expo avec l’API utilisateur légère",
    async () => {
      const response = await fetch("https://api.expo.dev/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${expoToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "query { meUserActor { id username } }",
        }),
      });

      expect(response.ok).toBe(true);
      const payload = (await response.json()) as {
        data?: { meUserActor?: { id?: string; username?: string } };
        errors?: Array<{ message?: string }>;
      };
      expect(payload.errors).toBeUndefined();
      expect(
        payload.data?.meUserActor?.id ?? payload.data?.meUserActor?.username,
      ).toBeTruthy();
    },
  );
});
