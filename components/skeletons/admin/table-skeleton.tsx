"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TableSkeleton({
  columns,
  rows = 10,
  columnWidths,
  withCheckbox = true,
  className,
}: {
  columns: number;
  rows?: number;
  /** Optional column widths as percentages or fixed values */
  columnWidths?: string[];
  withCheckbox?: boolean;
  className?: string;
}) {
  // Generate varied skeleton widths to look more natural
  const getCellWidth = (colIndex: number, rowIndex: number) => {
    if (columnWidths?.[colIndex]) return columnWidths[colIndex];
    const widths = ["w-3/4", "w-1/2", "w-2/3", "w-4/5", "w-1/3"];
    return widths[(colIndex + rowIndex) % widths.length];
  };

  return (
    <div className={cn(className)}>
      <Skeleton className="h-8 w-64 md:w-80" />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {withCheckbox && (
                <TableHead className="w-10">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                </TableHead>
              )}
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {withCheckbox && (
                  <TableCell className="w-10">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                  </TableCell>
                )}
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton
                      className={`h-4 ${getCellWidth(colIndex, rowIndex)}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
