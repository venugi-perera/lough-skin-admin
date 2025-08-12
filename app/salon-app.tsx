"use client";

import { useState } from "react";
import LoginPage from "./page";
import AdminDashboard from "@/components/admin-dashboard";

export default function SalonApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // if (!isLoggedIn) {
  //   return <LoginPage onLogin={handleLogin} />
  // }

  return <AdminDashboard onLogout={handleLogout} />;
}
