import { createFileRoute } from "@tanstack/react-router";
import ReviewQueue from "@/components/dashboard/review-queue";

export const Route = createFileRoute("/review")({
  component: ReviewQueue,
});
