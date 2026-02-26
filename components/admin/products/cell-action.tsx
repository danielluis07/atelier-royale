"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Edit, MoreHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const ProductsCellAction = ({ id }: { id: string }) => {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = searchParams.toString();
  const editPath = params
    ? `/admin/products/${id}?${params}`
    : `/admin/products/${id}`;

  if (!hasMounted) {
    return <Skeleton className="h-5 w-8 my-1.5" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(editPath)}>
          <Edit className="mr-2 size-4" />
          Editar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
