"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { LuX, LuMail, LuUserPlus, LuBell } from "react-icons/lu";

interface Notification {
  _id: string;
  type: "message" | "project_invite" | "system";
  title: string;
  description?: string;
}

// Config to remove repetitive icon rendering and right-column code blocks
const TYPE_MAP = {
  message: { Icon: LuMail, color: "text-buttons", bg: "bg-buttons/20", title: "Messages", desc: "Unread chat messages" },
  project_invite: { Icon: LuUserPlus, color: "text-texts-important", bg: "bg-texts-important/20", title: "Project Invites", desc: "Pending project invitations" },
  system: { Icon: LuBell, color: "text-ui-tertiary", bg: "bg-ui-tertiary/20", title: "System Alerts", desc: "General system notifications" }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    axios.get("")
      .then(res => {
        if (isMounted) setNotifications(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {}) // Suppress generic errors on an empty URL
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  // Highly Optimized single-pass count calculation (replaces 3 filter methods)
  const counts = { message: 0, project_invite: 0, system: 0 };
  for (const n of notifications) {
    if (counts[n.type] !== undefined) counts[n.type]++;
  }

  return (
    <div className="w-full min-h-screen bg-ui-main text-texts-primary p-6 md:p-10 flex flex-col md:flex-row gap-8">
      {/* Left Column: Notifications */}
      <div className="w-full md:w-1/3 flex flex-col gap-4 shrink-0">
        <h2 className="text-xl font-bold mb-2">Notifications</h2>

        {isLoading ? (
          <div className="w-full min-h-[300px] animate-pulse bg-ui-secondary/30 rounded-2xl"></div>
        ) : notifications.length === 0 ? (
          // Reserved empty space for future animation
          <div className="w-full min-h-[300px] rounded-2xl relative"></div>
        ) : (
          <div className="flex flex-col w-full">
            {notifications.map((notif) => (
              <SwipeableNotification key={notif._id} notification={notif} onDismiss={dismissNotification} />
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Menu */}
      <div className="w-full flex-1">
        <div className="bg-ui-secondary rounded-2xl p-6 border border-ui-tertiary/20 shadow-lg sticky top-8">
          <h3 className="text-lg font-bold mb-6 border-b border-ui-tertiary/30 pb-4">Summary</h3>
          <div className="flex flex-col gap-4">
            
            {/* DRY: Map over configuration instead of copy-pasting HTML */}
            {(Object.keys(TYPE_MAP) as Array<keyof typeof TYPE_MAP>).map((key) => {
              const { Icon, color, bg, title, desc } = TYPE_MAP[key];
              return (
                <div key={key} className="flex items-center gap-4 bg-ui-main/50 p-4 rounded-xl">
                  <div className={`p-3 ${bg} ${color} rounded-full shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm sm:text-base">{title}</h4>
                    <p className="text-xs sm:text-sm text-texts-secondary">{desc}</p>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">{counts[key]}</div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}

// Redundancy-free Swipeable Component (Removed isDragging boolean state variable to save renders)
function SwipeableNotification({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void; }) {
  const [dragX, setDragX] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const startX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const diff = e.clientX - startX.current;
    
    // Only update state if diff is positive or if returning back to 0 (reduces render noise)
    if (diff > 0) setDragX(diff);
    else if (dragX !== 0) setDragX(0);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Dismiss if dragged more than 100px or 25% of width
    if (dragX > Math.min(100, window.innerWidth * 0.25)) {
      triggerDismiss();
    } else {
      setDragX(0); // Snap back gracefully
    }
  };

  const triggerDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(notification._id), 500); 
  };

  // Fetch icon and classes from central configuration to avoid repeated if-statements
  const config = TYPE_MAP[notification.type] || TYPE_MAP.system;
  const Icon = config.Icon;

  return (
    <div
      className={`relative w-full touch-pan-y ${isDismissing ? "pointer-events-none" : ""}`}
      style={{
        transform: isDismissing ? "translateX(100%)" : `translateX(${dragX}px)`,
        opacity: isDismissing ? 0 : 1,
        maxHeight: isDismissing ? "0px" : "200px",
        marginBottom: isDismissing ? "0px" : "12px",
        overflow: "hidden",
        transition: dragX > 0 && !isDismissing ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out, max-height 0.3s ease-in-out 0.15s, margin-bottom 0.3s ease-in-out 0.15s",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="bg-ui-secondary text-texts-primary w-full p-4 rounded-xl border border-ui-tertiary/20 shadow-md flex flex-col gap-1 cursor-grab active:cursor-grabbing select-none relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerDismiss();
          }}
          className="absolute top-3 right-3 p-1 text-texts-secondary hover:text-texts-primary hover:bg-ui-tertiary/20 rounded-full transition-colors z-10"
          aria-label="Dismiss notification"
        >
          <LuX size={16} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Icon size={14} className={config.color} />
          <h4 className="font-bold text-sm line-clamp-1 pr-6">{notification.title}</h4>
        </div>
        
        {notification.description && (
          <p className="text-xs text-texts-secondary line-clamp-2">{notification.description}</p>
        )}
      </div>
    </div>
  );
}