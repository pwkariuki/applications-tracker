import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG, STATUS_LIST, type Status } from "@/data/types";

const SOURCES = [
  "Referral",
  "Careers page",
  "Wellfound",
  "GitHub list",
  "Email",
  "Other",
];

function AddApplicationDialog() {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("applied");
  const [source, setSource] = useState("Careers page");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const createApplication = useMutation(api.applications.create);

  function reset() {
    setCompany("");
    setRole("");
    setStatus("applied");
    setSource("Careers page");
    setNotes("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    setSubmitting(true);
    try {
      await createApplication({
        company: company.trim(),
        role: role.trim(),
        status,
        source,
        notes,
      });
      reset();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add application</DialogTitle>
          <DialogDescription>
            Track a new role you've applied to.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="company"
                className="mb-1.5 block text-sm font-medium"
              >
                Company
              </label>
              <Input
                id="company"
                placeholder="Stripe"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="mb-1.5 block text-sm font-medium"
              >
                Role
              </label>
              <Input
                id="role"
                placeholder="SWE, New Grad"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Status</label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as Status)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_LIST.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            STATUS_CONFIG[s].dot,
                          )}
                        />
                        {STATUS_CONFIG[s].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Source</label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
              Notes{" "}
              <span className="font-normal text-muted-foreground">
                — optional
              </span>
            </label>
            <Textarea
              id="notes"
              placeholder="Referral from Maya, recruiter is Alex…"
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddApplicationDialog;
