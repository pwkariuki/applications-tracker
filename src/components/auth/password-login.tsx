import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Briefcase,
  Loader2,
  MailOpen,
  RefreshCw,
  CheckCheck,
} from "lucide-react";
import { useState } from "react";

type Flow = "signIn" | "signUp";

function PasswordLogin() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<Flow>("signIn");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("flow", flow);

    try {
      await signIn("password", formData);
    } catch {
      setError(
        flow === "signIn"
          ? "Invalid email or password"
          : "Could not create account. The email may be in use.",
      );
      setSubmitting(false);
    }
  }

  const isSignIn = flow === "signIn";

  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen p-4 shadow-sm md:grid-cols-2">
        {/* Branding panel — hidden on small screens */}
        <div
          className="hidden rounded-2xl flex-col justify-between p-8 text-white md:flex"
          style={{ backgroundColor: "#26215C" }}
        >
          <div className="flex items-center gap-2.5 font-medium">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <Briefcase className="h-4 w-4" />
            </span>
            Applications Tracker
          </div>

          <div>
            <h2 className="text-2xl font-medium leading-tight">
              Your job search,
              <br />
              on autopilot.
            </h2>
            <ul className="mt-5 space-y-2.5">
              <li className="flex items-start gap-2 text-sm text-violet-200">
                <MailOpen className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                Reads application emails from your inbox
              </li>
              <li className="flex items-start gap-2 text-sm text-violet-200">
                <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                Updates statuses automatically
              </li>
              <li className="flex items-start gap-2 text-sm text-violet-200">
                <CheckCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                You confirm only the uncertain ones
              </li>
            </ul>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center bg-background p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignIn
                ? "Sign in to your tracker"
                : "Start tracking your applications"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  required
                  placeholder={
                    isSignIn ? "Enter your password" : "Create a password"
                  }
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSignIn ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isSignIn ? "New here? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setFlow(isSignIn ? "signUp" : "signIn");
                setError(null);
              }}
              className="font-medium text-primary hover:underline"
            >
              {isSignIn ? "Create an account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PasswordLogin;
