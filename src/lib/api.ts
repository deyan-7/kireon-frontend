import { createClient, createConfig } from "@hey-api/client-fetch";
import { type ClientOptions } from "@/client/types.gen";
import { auth } from "@/lib/auth";

let authToken: string | undefined = undefined;

let tokenReadyResolver: (() => void) | null = null;
const tokenReady = new Promise<void>((resolve) => {
  tokenReadyResolver = resolve;
});

auth.onIdTokenChanged(async (user) => {
  if (user) {
    try {
      authToken = await user.getIdToken();
    } catch (err) {
      console.error("Failed to refresh token", err);
      authToken = undefined;
    }
  } else {
    authToken = undefined;
  }

  if (tokenReadyResolver) {
    tokenReadyResolver();
    tokenReadyResolver = null;
  }
});

const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://hiring-agent-backend-staging-474483908861.europe-west3.run.app";

export const customClient = createClient(
  createConfig<ClientOptions>({
    baseUrl,
    async fetch(request: Request): Promise<Response> {
      await tokenReady;

      const headers = new Headers(request.headers);
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }

      const modifiedRequest = new Request(request, {
        headers,
        credentials: "include",
      });

      return fetch(modifiedRequest);
    },
  })
);
