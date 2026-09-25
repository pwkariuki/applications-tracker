// src/routes/settings.tsx  →  route /settings
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useAction } from "convex/react";
import { useState } from "react";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import { getGmailAuthUrl } from "@/lib/gmail-auth";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const gmail = useQuery(api.gmail.connectionStatus);
  const disconnect = useAction(api.gmail.disconnect);
  const [working, setWorking] = useState(false);

  async function handleDisconnect() {
    setWorking(true);
    try {
      await disconnect();
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        to="/"
        className="mb-7 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Applications
      </Link>

      <h1 className="mb-1 text-xl font-semibold tracking-tight">Settings</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Manage connected accounts and integrations.
      </p>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </span>
            <div>
              <div className="text-sm font-medium">Gmail</div>
              <div className="text-xs text-muted-foreground">
                {gmail?.connected
                  ? `Connected${gmail.email ? ` · ${gmail.email}` : ""}`
                  : "Not connected"}
              </div>
            </div>
          </div>

          {gmail?.connected ? (
            <AlertDialog>
              <AlertDialogTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                Disconnect
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disconnect Gmail?</AlertDialogTitle>
                  <AlertDialogDescription>
                    We'll stop reading your inbox and revoke access. Your
                    applications stay — only the automatic email tracking stops.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDisconnect}
                    className={cn(buttonVariants({ variant: "destructive" }))}
                  >
                    {working ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Disconnect"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                window.location.href = getGmailAuthUrl();
              }}
            >
              <Mail className="h-4 w-4" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
