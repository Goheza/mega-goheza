import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/brand/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Goheza" }] }),
  component: () => <Outlet />,
});
