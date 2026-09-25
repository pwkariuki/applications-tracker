import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "@/components/header/navbar";
import Footer from "@/components/dashboard/footer";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
