"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/api/use-auth";
import { toast } from "sonner";
import type { RegisterData } from "@/api/auth-context";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    phone_number: "",
    username: "",
    password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirm_password) {
      toast("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      toast("Registration successful");
      router.push("/auth/login");
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="mt-2 text-gray-600">
              Please enter your details to create an account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium"
              >
                Phone number
              </label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                showPasswordToggle
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium"
              >
                Confirm password
              </label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                minLength={6}
                showPasswordToggle
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <Separator className="my-4" />
            <p className="text-sm text-gray-500">Already have an account?</p>
            <Button variant="outline" className="mt-2 w-full" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
