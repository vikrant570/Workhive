"use client"
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";

import {
  LuChevronDown,
  LuChartBar,
  LuMail,
  LuFolderOpen,
  LuBell,
  LuUser,
  LuHouse,
  LuHexagon,
  LuUsers
} from "react-icons/lu";

const UserSidebar = () => {
  const { user } = useUserContext();

  const navLinks = [
    { name: "Home", icon: <LuHouse size={18} />, href: "/" },
    { name: "Dashboard", icon: <LuChartBar size={18} />, href: "/dashboard" },
    { name: "My Projects", icon: <LuFolderOpen size={18} />, href: "/projects" },
    { name: "Chats", icon: <LuMail size={18} />, href: "/chats" },
    { name: "Notifications", icon: <LuBell size={18} />, href: "/notifications" },
    { name: "Socials", icon: <LuUsers size={18} />, href: "/socials" }
  ];

  return (
    <div className="h-full fixed left-0 top-0 bg-ui-secondary w-50 flex flex-col border-r border-ui-tertiary/10 shadow-xl z-50">

      {/* 1. Logo Section - More Vertical Breathing Room */}
      <div className="h-20 flex items-center px-5 border-b border-ui-tertiary/5 mb-4">
        <LuHexagon className="text-buttons mr-2 w-6 h-6 fill-buttons/20" />
        <h1 className="text-buttons text-2xl font-bold tracking-tight">WORKHIVE</h1>
      </div>

      {/* 2. Navigation Links - Clean list with hover effects */}
      <div className="flex-1 flex flex-col gap-2 px-3 overflow-y-auto">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="group flex items-center gap-3 px-4 py-3 text-texts-secondary rounded-xl hover:bg-ui-main hover:text-white transition-all duration-200 ease-in-out"
          >
            <span className="text-buttons opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-200">
              {link.icon}
            </span>
            <span className="font-medium text-sm">{link.name}</span>
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
