"use client";

import { Input } from "@/components/ui/input";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { X, Search } from "lucide-react";

export const DataSearch = ({
  searchInput,
  setSearchInput,
  searchPlaceholder = "Procurar...",
}: {
  searchInput: string;
  setSearchInput: (value: string) => void;
  searchPlaceholder?: string;
}) => {
  const hasMounted = useHasMounted();

  return (
    <div className="relative w-80">
      <Search className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={searchPlaceholder}
        value={searchInput}
        disabled={!hasMounted}
        onChange={(e) => setSearchInput(e.target.value)}
        className="pl-8 pr-8 w-full md:w-80"
      />
      {searchInput && (
        <button
          type="button"
          aria-label="Clear search"
          disabled={!hasMounted}
          className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => setSearchInput("")}>
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};
