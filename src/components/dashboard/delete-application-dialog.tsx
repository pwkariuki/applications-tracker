import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { useRef, useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

type DeleteApplicationDialogProps = {
  id: Id<"applications">;
  company: string;
  role: string;
  onDeleted?: () => void;
};

function DeleteApplicationDialog({
  id,
  company,
  role,
  onDeleted,
}: DeleteApplicationDialogProps) {
  const deleteApplication = useMutation(api.applications.remove);
  const [open, setOpen] = useState(false);
  const confirmedRef = useRef(false);

  function handleConfirm(e: React.MouseEvent) {
    e.stopPropagation();
    confirmedRef.current = true;
    setOpen(false);
  }

  function handleCloseAutoFocus(e: Event) {
    e.preventDefault();
    if (confirmedRef.current) {
      confirmedRef.current = false;
      deleteApplication({ id }).then(() => onDeleted?.());
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive" }),
          "w-full cursor-pointer",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Trash className="h-4 w-4" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent
        onClick={(e) => e.stopPropagation()}
        onCloseAutoFocus={handleCloseAutoFocus}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {role} application at {company} and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
              onDeleted?.();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteApplicationDialog;
