import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_CONFIG, STATUS_LIST, type Status } from "@/data/types";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

type SelectStatusProps = {
  id: Id<"applications">;
  status: Doc<"applications">["status"];
};

function SelectStatus({ id, status }: SelectStatusProps) {
  const [value, setValue] = useState<Status>(status);
  const updateStatus = useMutation(api.applications.updateStatus);

  const handleChange = async (v: Status) => {
    setValue(v);
    await updateStatus({ id, status: v });
  };

  return (
    <Select value={value} onValueChange={(v) => handleChange(v as Status)}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_LIST.map((s) => (
          <SelectItem key={s} value={s}>
            <span className="flex items-center gap-2">
              <span
                className={cn("h-2 w-2 rounded-full", STATUS_CONFIG[s].dot)}
              />
              {STATUS_CONFIG[s].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectStatus;
