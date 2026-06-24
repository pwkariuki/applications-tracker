import { useState } from "react";
import { useMutation } from "convex/react";
import { Pencil, Loader2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function NotesEditor({
  id,
  initial,
}: {
  id: Id<"applications">;
  initial?: string;
}) {
  const updateNotes = useMutation(api.applications.updateNotes);

  const [editing, setEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(initial ?? "");
  const [saving, setSaving] = useState<boolean>(false);

  function startEditing() {
    setDraft(initial ?? ""); // start from currently saved notes
    setEditing(true);
  }

  function cancel() {
    setDraft(initial ?? ""); // throw away changes
    setEditing(false);
  }

  async function save() {
    setSaving(true);
    try {
      await updateNotes({ id, notes: draft });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Notes</span>
        {!editing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            aria-label="Edit notes"
            onClick={startEditing}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {editing ? (
        <div>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add notes — recruiter name, follow-up dates, interview prep…"
            className="min-h-40 resize-y leading-relaxed"
            autoFocus
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={cancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="min-h-20 rounded-lg border p-4 text-sm leading-relaxed"
          onClick={startEditing}
        >
          {initial ? (
            <p className="whitespace-pre-wrap">{initial}</p>
          ) : (
            <p className="cursor-text text-muted-foreground">
              No notes yet. Click to add.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default NotesEditor;
