import React from "react";
import { Bell, Sparkles, Trophy, Flame, Code2, Lock, CheckCheck, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "../types";

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  xp: Sparkles,
  achievement: Trophy,
  streak: Flame,
  challenge: Code2,
  unlock: Lock,
  system: Bell,
};

const TYPE_COLORS: Record<string, string> = {
  xp: "text-warning bg-warning/10",
  achievement: "text-primary bg-secondary",
  streak: "text-primary bg-green-soft",
  challenge: "text-foreground bg-muted",
  unlock: "text-primary bg-secondary",
  system: "text-muted-foreground bg-muted",
};

function NotifItem({ notif, onRead }: { notif: Notification; onRead: () => void }) {
  const Icon = TYPE_ICONS[notif.type] ?? Bell;
  const colors = TYPE_COLORS[notif.type] ?? TYPE_COLORS.system;

  return (
    <div onClick={onRead}
      className={`flex gap-4 p-4 border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/30 ${!notif.read ? "bg-primary/2" : ""}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colors}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold ${!notif.read ? "text-foreground" : "text-foreground"}`}>{notif.title}</p>
          {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <Clock size={10} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 text-xs text-primary font-medium hover:text-primary/80 transition-colors">
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={36} className="text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notif => (
            <NotifItem key={notif.id} notif={notif} onRead={() => markNotificationRead(notif.id)} />
          ))
        )}
      </div>
    </div>
  );
}
