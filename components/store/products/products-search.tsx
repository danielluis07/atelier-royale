"use client";

import { useHasMounted } from "@/hooks/use-has-mounted";
import { X, Search } from "lucide-react";

export const ProductsSearch = ({
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
    <div className="relative w-full sm:w-80">
      <Search
        className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.5}
      />
      <input
        placeholder={searchPlaceholder}
        value={searchInput}
        disabled={!hasMounted}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full h-10 pl-11 pr-10 bg-transparent border border-border text-sm font-sans tracking-wide placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors duration-300"
      />
      {searchInput && (
        <button
          type="button"
          aria-label="Limpar busca"
          disabled={!hasMounted}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          onClick={() => setSearchInput("")}>
          <X className="size-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};
