import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});
