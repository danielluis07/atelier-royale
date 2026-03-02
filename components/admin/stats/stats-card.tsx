import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export const StatsCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) => {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <div className="p-2 bg-muted rounded-md">
          <Icon className="w-4 h-4 text-foreground" />
        </div>
      </div>
      <CardContent className="p-0">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
};
