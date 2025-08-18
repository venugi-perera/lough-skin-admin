"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "./salon-app";
import RootLayout from "@/app/layout";

export default function SalonApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      router.push("/admin/dashboard"); // redirect if already logged in
    }
  }, [router]);

  const handleLogin = (token: string) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    router.push("/admin/dashboard"); // redirect after login
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/"); // redirect to login page
  };

  return (
    <RootLayout>
      {!isLoggedIn && <LoginPage onLogin={handleLogin} />}
    </RootLayout>
  );
}
