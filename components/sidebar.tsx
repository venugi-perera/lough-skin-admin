"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Calendar,
  Scissors,
  Clock,
  Users,
  Settings,
} from "lucide-react";

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Calendar,
    path: "/admin/dashboard",
  },
  {
    id: "services",
    label: "Services",
    icon: Scissors,
    path: "/admin/services",
  },
  { id: "bookings", label: "Bookings", icon: Clock, path: "/admin/bookings" },
  {
    id: "category",
    label: "Categories",
    icon: Users,
    path: "/admin/categories",
  },
  // { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  // setIsLoggedIn: any;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}: // setIsLoggedIn,
SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Highlight correct tab based on current route
  useEffect(() => {
    const active = sidebarItems.find((item) => item.path === pathname);
    if (active) setActiveTab(active.id);
  }, [pathname, setActiveTab]);

  const onLogout = () => {
    // setIsLoggedIn(false);
    localStorage.removeItem("token");
    router.push("/"); // redirect to home page
  };

  return (
    <div
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <span className="text-xl font-bold">Lough Skin</span>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </Button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
                router.push(item.path);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === item.id
                  ? "bg-pink-50 text-pink-600 border-r-2 border-pink-600"
                  : "text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-6 border-t">
        <Button variant="outline" className="w-full" onClick={() => onLogout()}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
}
