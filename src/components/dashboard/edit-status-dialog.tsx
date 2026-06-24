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
import { Pencil, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { STATUS_CONFIG, STATUS_LIST, type Status } from "@/data/types";

type EditStatusDialogProps = {
  id: Id<"applications">;
  status: Doc<"applications">["status"];
  onEdit?: () => void;
};

function EditStatusDialog({ id, status, onEdit }: EditStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Status>(status);
  const [saving, setSaving] = useState(false);

  const updateStatus = useMutation(api.applications.updateStatus);

  // Reset the select back to the row's current status each time the dialog opens,
  // so a previous cancel doesn't leave a stale choice.
  function handleOpenChange(next: boolean) {
    if (next) setValue(status);
    setOpen(next);
  }

  async function handleSave() {
    if (value !== status) {
      setSaving(true);
      try {
        await updateStatus({ id, status: value });
      } finally {
        setSaving(false);
      }
    }
    setOpen(false);
    onEdit?.();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full cursor-pointer justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className="h-4 w-4" />
          Edit status
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Update status</DialogTitle>
          <DialogDescription>
            Move this application along your pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="py-1">
          <label className="mb-2 block text-sm font-medium">Status</label>
          <Select value={value} onValueChange={(v) => setValue(v as Status)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((s) => (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} onClick={() => onEdit?.()}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditStatusDialog;
