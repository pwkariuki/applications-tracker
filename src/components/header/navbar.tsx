import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Briefcase } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ThemeToggle } from "./theme-toggle";

function Navbar() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.viewer);

  const email = user?.email ?? "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "··";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-5xl items-center gap-3 px-4 py-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
          <Briefcase className="h-4.5 w-4.5" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight tracking-tight">
            Applications Tracker
          </span>
          <span className="hidden text-xs leading-tight text-muted-foreground sm:block">
            Track every application, interview, and offer in one place.
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Account menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-violet-500 text-xs text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="text-sm font-medium">Account</div>
                {email && (
                  <div className="truncate text-xs text-muted-foreground">
                    {email}
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem disabled>
                <User className="h-4 w-4" />
                Settings
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
