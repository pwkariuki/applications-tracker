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

  async function handleDelete() {
    await deleteApplication({ id });
    onDeleted?.();
  }

  return (
    <AlertDialog>
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

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {role} application at {company} and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: "outline" }))}
            onClick={() => onDeleted?.()}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
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
