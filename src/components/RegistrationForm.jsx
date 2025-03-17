"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/app/actions/register";

export function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, action, pending] = useActionState(register, undefined);

  // State for input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state?.message === "Registration Successful") {
      const redirectTimer = setTimeout(() => {
        router.push("/page/login");
      }, 4800);
      return () => {
        clearTimeout(redirectTimer);
      };
    }
  }, [state?.message, router]);

  const preventSpace = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <Card className="mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details to create your account
        </CardDescription>
        {state?.message && (
          <p
            className={`text-sm ${
              state.message === "Registration Successful"
                ? "text-green-500"
                : "text-orange-500"
            }`}
          >
            {state.message}
            {state.message === "Registration Successful" &&
              ` [redirecting to login page...]`}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form action={action}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="John Doe"
                required
                aria-invalid={!!state?.errors?.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {state?.errors?.name && (
                <p className="text-red-500 text-sm">{state.errors.name}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                aria-invalid={!!state?.errors?.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {state?.errors?.email && (
                <p className="text-red-500 text-sm">{state.errors.email}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  onKeyDown={preventSpace}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {state?.errors?.password && (
                <p className="text-red-500 text-sm">{state.errors.password}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  aria-invalid={!!state?.errors?.confirmPassword}
                  onKeyDown={preventSpace}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {state?.errors?.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {state.errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button className="w-full" type="submit" disabled={pending}>
              Register
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
