"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "./sidebar";
import { toast } from "sonner";

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState("signup");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.trim()) {
      newErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number required";
    if (!formData.password) newErrors.password = "Password required";
    if (formData.password.length < 6)
      newErrors.password = "Min 6 characters required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      toast.error("Invalid form", {
        description: "Please fill out all required fields properly.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
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

      const data = await res.json();
      if (res.ok) {
        toast.success("Account created ✅", {
          description: "Your salon admin account was created successfully.",
        });
        localStorage.setItem("token", data.token);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
        });
      } else {
        toast.error("Signup failed", {
          description: data.message || "Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", {
        description: "Failed to connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Create Account
            </h2>
            <p className="text-muted-foreground">
              Set up your salon admin account
            </p>
          </div>
        </div>

        <Card className="pt-6">
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* <div className="flex items-center space-x-2 mb-4">
              <button
                type="button"
                onClick={() =>
                  handleInputChange("agreeToTerms", !formData.agreeToTerms)
                }
                className={`flex items-center justify-center w-4 h-4 border rounded ${
                  formData.agreeToTerms
                    ? "bg-[#a67c5b] border-[#a67c5b] text-white"
                    : "border-gray-300"
                }`}
              >
                {formData.agreeToTerms && (
                  <span className="text-xs font-bold">✓</span>
                )}
              </button>
              <span className="text-sm text-gray-700">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </div> */}
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500 mb-4">{errors.agreeToTerms}</p>
            )}

            <Button
              onClick={handleSignup}
              disabled={loading}
              className="w-full sm:w-auto bg-[#a67c5b] hover:bg-[#8c674b]"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
