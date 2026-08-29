import { createFileRoute } from "@tanstack/react-router";
import ReviewQueue from "@/components/header/review-queue";

export const Route = createFileRoute("/review")({
  component: ReviewQueue,
});
