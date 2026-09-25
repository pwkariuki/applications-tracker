import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import { consumeGmailOAuthState } from "@/lib/gmail-auth";

export const Route = createFileRoute("/auth/gmail/callback")({
  component: GmailCallback,
});

function GmailCallback() {
  const navigate = useNavigate();
  const exchange = useAction(api.gmailAuth.exchangeGmailCode);
  const [error, setError] = useState<string | null>(null);
  // Guard against the effect running twice (React strict mode / re-render),
  // which would try to exchange the single-use code twice.
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const returnedState = params.get("state");
    const oauthError = params.get("error"); // e.g. user clicked "cancel"
    const expectedState = consumeGmailOAuthState();

    // The code is single-use — don't leave it (or the other OAuth params)
    // sitting in the URL bar or browser history.
    window.history.replaceState(null, "", window.location.pathname);

    // Every failure throws so errors surface through the single catch below.
    const connect = async () => {
      if (oauthError) throw new Error("Gmail connection was cancelled.");
      if (!code) throw new Error("No authorization code returned.");
      if (!returnedState || returnedState !== expectedState) {
        throw new Error(
          "Couldn't verify this request came from you. Please try connecting again.",
        );
      }
      await exchange({ code });
      await navigate({ to: "/review" });
    };

    connect().catch((e) => setError(e.message ?? "Failed to connect Gmail."));
  }, [exchange, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      {error ? (
        <>
          <p className="text-sm font-medium">Couldn't connect Gmail</p>
          <p className="max-w-xs text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate({ to: "/review" })}
            className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to review queue
          </button>
        </>
      ) : (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Connecting your Gmail…
          </p>
        </>
      )}
    </div>
  );
}
