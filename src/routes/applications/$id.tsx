import ApplicationDetail from "@/components/detail/detail-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/applications/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <ApplicationDetail id={id} />;
}
