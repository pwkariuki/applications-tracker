import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import PasswordLogin from "./auth/password-login.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createRouter({ routeTree, basepath: "/" });

// The Gmail OAuth callback returns to /auth/gmail/callback?code=... Convex Auth
// grabs any `code` param on mount (assuming its own OAuth/magic-link redirect),
// strips it from the URL, and tries to redeem it. We only use the Password
// provider, so skip its code handling here and let our route read the code.
const isGmailCallback = () =>
  window.location.pathname.startsWith("/auth/gmail/callback");

// Tell TanStack Router about our router instance for type safety in route components
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider
      client={convex}
      shouldHandleCode={() => !isGmailCallback()}
    >
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center" />
      </AuthLoading>
      <Unauthenticated>
        <PasswordLogin />
      </Unauthenticated>
      <Authenticated>
        <RouterProvider router={router} />
      </Authenticated>
    </ConvexAuthProvider>
  </StrictMode>,
);
