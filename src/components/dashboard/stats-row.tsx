import { Card, CardContent } from "@/components/ui/card";

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <Card className="bg-muted/50 shadow">
      <CardContent>
        <div className={`text-2xl font-medium leading-none ${accent ?? ""}`}>
          {value}
        </div>
        <div className="mt-1.5 text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

// TODO: pass applications data for factual display
function StatsRow() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      <Stat label="Total Applied" value="10" />
      <Stat
        label="Active"
        value="5"
        accent="text-blue-600 dark:text-blue-400"
      />
      <Stat
        label="Offers"
        value="1"
        accent="text-emerald-600 dark:text-emerald-400"
      />
      <Stat label="Response Rate" value="70%" />
    </div>
  );
}

export default StatsRow;
