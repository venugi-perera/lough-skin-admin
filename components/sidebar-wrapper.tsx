"use client";

import { useState, useEffect } from "react";
import Sidebar from "./sidebar";

interface Props {
  children: React.ReactNode;
}

export default function SidebarWrapper({ children }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const isLoggedIn = !!token;

  return (
    <div className="flex h-screen bg-gray-50">
      {isLoggedIn && (
        <Sidebar
          activeTab=""
          setActiveTab={() => {}}
          sidebarOpen={true}
          setSidebarOpen={() => {}}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="m-4 p-2 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
