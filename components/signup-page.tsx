"use client";

import type React from "react";
import { useState } from "react";
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
import { Eye, EyeOff, Scissors, ArrowLeft, Check } from "lucide-react";

interface SignupPageProps {
  onSignup: () => void;
  onBackToLogin: () => void;
}

export default function SignupPage({
  onSignup,
  onBackToLogin,
}: SignupPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/signUp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              password: formData.password,
              imageUrl: "",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Signup failed");

        localStorage.setItem("token", data.token);
        onSignup();
      } catch (err: any) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e1c9b3] to-[#a67c5b]/30 p-4">
      <Card className="w-full max-w-lg border border-[#a67c5b]/30 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToLogin}
              className="h-8 w-8 text-[#a67c5b]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {/* <div className="flex justify-center">
              <div className="p-3 bg-[#e1c9b3] rounded-full">
                <Scissors className="h-8 w-8 text-[#a67c5b]" />
              </div>
            </div> */}
            <div className="w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-[#a67c5b]">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-[#4b3a2f]">
            Set up your salon admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiError && (
            <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-sm text-[#a67c5b] px-2">
                  Personal Information
                </span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#4b3a2f]">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`${
                      errors.firstName
                        ? "border-red-500"
                        : "border-[#a67c5b]/40 focus:border-[#a67c5b] focus:ring-[#a67c5b]"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#4b3a2f]">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`${
                      errors.lastName
                        ? "border-red-500"
                        : "border-[#a67c5b]/40 focus:border-[#a67c5b] focus:ring-[#a67c5b]"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#4b3a2f]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`${
                    errors.email
                      ? "border-red-500"
                      : "border-[#a67c5b]/40 focus:border-[#a67c5b] focus:ring-[#a67c5b]"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#4b3a2f]">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`${
                    errors.phone
                      ? "border-red-500"
                      : "border-[#a67c5b]/40 focus:border-[#a67c5b] focus:ring-[#a67c5b]"
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-sm text-[#a67c5b] px-2">Security</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#4b3a2f]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`${
                      errors.password
                        ? "border-red-500"
                        : "border-[#a67c5b]/40 focus:border-[#a67c5b] focus:ring-[#a67c5b]"
                    }`}
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
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#4b3a2f]">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-[#a67c5b]/40 focus:border-[#a67c5b] focus:ring-[#a67c5b]"
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-[#a67c5b]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange("agreeToTerms", !formData.agreeToTerms)
                  }
                  className={`flex items-center justify-center w-4 h-4 mt-0.5 border rounded ${
                    formData.agreeToTerms
                      ? "bg-[#a67c5b] border-[#a67c5b] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {formData.agreeToTerms && <Check className="h-3 w-3" />}
                </button>
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    I agree to the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-[#a67c5b] hover:text-[#8c674b]"
                    >
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-[#a67c5b] hover:text-[#8c674b]"
                    >
                      Privacy Policy
                    </Button>
                  </span>
                </div>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#a67c5b] hover:bg-[#8c674b] text-white"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-[#a67c5b] hover:text-[#8c674b]"
                onClick={onBackToLogin}
              >
                Sign in
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
