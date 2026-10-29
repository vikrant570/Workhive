"use client"
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";

import {
  LuChevronDown,
  LuChartBar,
  LuMail,
  LuFolderOpen,
  LuBell,
  LuHouse,
  LuHexagon,
  LuUsers
} from "react-icons/lu";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

const UserSidebar = () => {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState<{ socials: number, messages: number } | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      const res = await api.get("/socials/notifications", { withCredentials: true });
      if (!res || !res.data.success) return;
      setNotifications(res.data.notifications);
    }
    fetchNotifications();
  }, [])

  const navLinks = [
    { name: "Home", icon: <LuHouse size={18} />, href: "/" },
    { name: "Dashboard", icon: <LuChartBar size={18} />, href: "dashboard" },
    { name: "My Projects", icon: <LuFolderOpen size={18} />, href: "projects" },
    { name: "Chats", icon: <LuMail size={18} />, href: "chats" },
    { name: "Notifications", icon: <LuBell size={18} />, href: "notifications" },
    { name: "Socials", icon: <LuUsers size={18} />, href: "socials" }
  ];

  const resetNotificationCount = (path: string) => {
    if (path == "socials" || path == "chats") {
      const key = path == "chats" ? "messages" : "socials";
      if (notifications?.[key] == 0 || !notifications) return;

      setNotifications(prev => prev && {
        ...prev,
        [key]: 0
      });
    }
  }
  const notificationsCountRead = (path: string) => {
    if (path == "chats" || path == "socials") {
      const key = path == "chats" ? "messages" : "socials";
      if (notifications && notifications[key] > 0) {
        return (
          <div className="absolute bottom-1 -right-9 px-1 py-0 text-texts-primary text-xs bg-red-500/90 rounded-full">
            {notifications[key]}{notifications[key] > 9 ? "+" : ""}
          </div>)
      }
    }
    return null
  }

  return (
    <div className="h-full fixed left-0 top-0 bg-ui-secondary w-50 flex flex-col border-r border-ui-tertiary/10 shadow-xl z-50">

      {/* 1. Logo Section - More Vertical Breathing Room */}
      <div className="h-20 flex items-center px-5 border-b border-ui-tertiary/5 mb-4">
        <LuHexagon className="text-buttons mr-2 w-6 h-6 fill-buttons/20" />
        <h1 className="text-buttons text-2xl font-bold tracking-tight">WORKHIVE</h1>
      </div>

      {/* 2. Navigation Links - Clean list with hover effects */}
      <div className="flex-1 flex flex-col gap-2 px-3 overflow-y-auto">
        {notifications && navLinks.map((link) => (
          <Link
            key={link.name}
            href={`/${link.href}`}
            onClick={() => resetNotificationCount(link.href)}
            className="group flex items-center gap-3 px-4 py-3 text-texts-secondary rounded-xl hover:bg-ui-main hover:text-white transition-all duration-200 ease-in-out"
          >
            <span className="text-buttons opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-200">
              {link.icon}
            </span>
            <span className="font-medium text-sm relative">
              {link.name}
              {notificationsCountRead(link.href)}
            </span>
          </Link>
        ))}
      </div>

      {/* 3. User Profile - Redesigned as a bottom card */}
      <div className="p-4 border-t border-ui-tertiary/5 bg-ui-secondary">
        <Link
          href={`${!user ? "/auth" : "/profile"}`}
          className="flex items-center gap-3 p-3 rounded-2xl bg-ui-main/50 border border-ui-tertiary/10 hover:border-buttons/40 hover:bg-ui-main transition-all duration-200 cursor-pointer group"
        >
          <div className="w-9 h-9 min-w-[36px] bg-buttons rounded-full flex items-center justify-center font-bold text-ui-main text-sm shadow-lg shadow-buttons/20 group-hover:scale-105 transition-transform">
            {user?.fullname?.[0] || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate leading-tight">
              {user?.username || ""}
            </p>
            <p className="text-[10px] text-texts-secondary truncate">{user ? "View Profile" : "SignIn"}</p>
          </div>
          <LuChevronDown size={14} className="text-texts-secondary group-hover:text-buttons transition-colors" />
        </Link>
      </div>
    </div>
  );
};

export default UserSidebar;
