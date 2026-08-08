import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Flow = "signIn" | "signUp";

function PasswordLogin() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<Flow>("signIn");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("flow", flow);

    try {
      await signIn("password", formData);
    } catch {
      setError(
        flow == "signIn"
          ? "Invalid email or password"
          : "Could not create account. The email may be in use.",
      );
      setSubmitting(false);
    }
  }

  const isSignIn = flow == "signIn";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
            {isSignIn ? "Sign in to your account" : "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {isSignIn ? " Or " : "Already have an account? "}
            <Button
              type={"button"}
              onClick={() => {
                setFlow(isSignIn ? "signUp" : "signIn");
                setError(null);
              }}
              variant={"ghost"}
              className="font-medium text-primary hover:text-primary/80 hover:underline"
            >
              {isSignIn ? "create a new account" : "sign in instead"}
            </Button>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type={"email"}
                autoComplete={"email"}
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
                type={"password"}
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
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : isSignIn ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default PasswordLogin;
