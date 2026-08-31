import { useQuery, useMutation } from "convex/react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Inbox, Mail } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { getGmailAuthUrl } from "@/lib/gmail-auth";

function ReviewQueue() {
  const items = useQuery(api.reviewQueue.list) ?? [];
  const gmail = useQuery(api.gmail.connectionStatus);
  const approve = useMutation(api.reviewQueue.approve);
  const dismiss = useMutation(api.reviewQueue.dismiss);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/"
        className="mb-7 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Applications
      </Link>

      <div className="mb-1 flex items-baseline gap-2.5">
        <h1 className="text-xl font-semibold tracking-tight">Review queue</h1>
        {items.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {items.length} pending
          </span>
        )}
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Emails we weren't confident enough to apply automatically. Confirm or
        dismiss.
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-6 w-6 text-muted-foreground" />
          </div>
          {gmail && !gmail.connected ? (
            <>
              <h3 className="mt-4 text-base font-medium">
                Auto-track from your inbox
              </h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Connect Gmail and we'll read application emails and update
                statuses for you — you just confirm the uncertain ones here.
              </p>
              <Button
                className="mt-5"
                onClick={() => {
                  window.location.href = getGmailAuthUrl();
                }}
              >
                <Mail className="h-4 w-4" />
                Connect Gmail
              </Button>
            </>
          ) : (
            <>
              <h3 className="mt-4 text-base font-medium">All caught up</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Nothing waiting for review. New low-confidence matches will show
                up here.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {item.emailSubject}
                  </div>
                  {item.emailFrom && (
                    <div className="truncate text-xs text-muted-foreground">
                      {item.emailFrom}
                    </div>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  {Math.round(item.confidence * 100)}% confidence
                </span>
              </div>

              <p className="my-3 rounded-md bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                {item.emailSnippet}
              </p>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">{item.proposedCompany}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">set status to</span>
                <StatusBadge status={item.proposedStatus} />
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => approve({ id: item._id as Id<"reviewQueue"> })}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismiss({ id: item._id as Id<"reviewQueue"> })}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewQueue;
