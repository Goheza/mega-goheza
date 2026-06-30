import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/brand/campaigns")({
  head: () => ({ meta: [{ title: "Campaigns — Goheza" }] }),
  component: () => <Outlet />,
});
