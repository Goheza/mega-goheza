import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, AlertTriangle, DollarSign, Sparkles, Clock } from "lucide-react";
import { DashCard, PageHeader } from "@/components/creator/dash-ui";
import { notifications } from "@/components/creator/dash-data";

export const Route = createFileRoute("/creator/notifications")({
  component: NotificationsPage,
});

const iconMap = {
  approval: <CheckCircle2 className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  new: <Sparkles className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />,
  payment: <DollarSign className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  revision: <AlertTriangle className="h-4 w-4 text-[oklch(0.5_0.18_45)]" />,
  deadline: <Clock className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
};

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle="Stay on top of approvals, payouts, and new opportunities." action={
        <button className="rounded-full border border-hairline bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
          Mark all as read
        </button>
      } />

      <DashCard className="p-0">
        <ul className="divide-y divide-hairline">
          {notifications.map((n) => (
            <li key={n.id} className={`flex items-start gap-4 p-5 ${!n.read ? "bg-[oklch(0.97_0.02_75)]" : ""}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated ring-1 ring-hairline">
                {iconMap[n.kind] ?? <Bell className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">{n.time}</p>
              {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </li>
          ))}
        </ul>
      </DashCard>
    </div>
  );
}
