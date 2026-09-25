import { Link } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

function ReviewNavButton() {
  const pending = useQuery(api.reviewQueue.pendingCount) ?? 0;

  return (
    <Button variant={"outline"} size={"icon"} className="relative" asChild>
      <Link to="/review" aria-label="Review queue">
        <ClipboardCheck className="h-4 w-4" />
        {pending > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
            {pending > 9 ? "9+" : pending}
          </span>
        )}
      </Link>
    </Button>
  );
}

export default ReviewNavButton;
