"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import SignupPage from "@/components/signup-page";

interface LoginPageProps {
  onLogin: any;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ include cookies/session
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token and call parent handler
      onLogin(data.token);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  if (isSignup) {
    return (
      <SignupPage
        onSignup={() => {}}
        onBackToLogin={() => setIsSignup(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e1c9b3] to-[#a67c5b]/40 p-4">
      <Card className="w-full max-w-md border border-[#a67c5b]/30 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-[#a67c5b]">
            Lough Skin
          </CardTitle>
          <CardDescription className="text-[#4b3a2f]">
            Sign in to manage your salon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#4b3a2f]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@salon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#a67c5b]/40 focus:border-[#a67c5b] focus:ring-[#a67c5b]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#4b3a2f]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[#a67c5b]/40 focus:border-[#a67c5b] focus:ring-[#a67c5b]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-[#a67c5b]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#a67c5b] hover:bg-[#8c674b] text-white"
            >
              Sign In
            </Button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
          )}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-[#a67c5b] hover:text-[#8c674b]"
                onClick={() => setIsSignup(true)}
              >
                Create account
              </Button>
            </p>
          </div>
          <div className="mt-2 text-center text-sm text-gray-500">
            Demo credentials: admin@salon.com / password
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
