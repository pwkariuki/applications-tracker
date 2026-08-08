import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import PasswordLogin from "./auth/password-login.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createRouter({ routeTree, basepath: "/" });

// Tell TanStack Router about our router instance for type safety in route components
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <Unauthenticated>
        <PasswordLogin />
      </Unauthenticated>
      <Authenticated>
        <RouterProvider router={router} />
      </Authenticated>
    </ConvexAuthProvider>
  </StrictMode>,
);
