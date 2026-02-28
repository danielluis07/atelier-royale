"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Search } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useRouter } from "next/navigation";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const isMounted = useHasMounted();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = useMemo(() => searchInput.trim(), [searchInput]);
  const hasValue = trimmed.length > 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hasValue) return;

    router.push(`/products?search=${encodeURIComponent(trimmed)}&page=1`);
    setOpen(false);
  }

  function clear() {
    setSearchInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  if (!isMounted) {
    return (
      <button
        aria-label="Buscar"
        disabled
        className="text-muted-foreground hover:text-foreground transition-colors duration-300">
        <Search className="w-4.5 h-4.5" strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearchInput("");
      }}>
      <button
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        className="text-muted-foreground hover:text-foreground transition-colors duration-300">
        <Search className="w-4.5 h-4.5" strokeWidth={1.5} />
      </button>

      <DialogContent className="rounded-none w-full lg:w-4/5 h-40 [&>button]:hidden">
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>Procurar</DialogTitle>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <DialogDescription>
              Digite o nome ou marca do produto que deseja encontrar.
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                aria-label="Procurar por nome ou marca..."
                placeholder="Procurar por nome ou marca..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && searchInput.length > 0) {
                    e.preventDefault();
                    clear();
                  }
                }}
                className="w-full h-10 pl-2 pr-20 bg-transparent border border-border text-sm font-sans tracking-wide placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors duration-300"
              />

              <button
                type="submit"
                aria-label="Buscar"
                disabled={!hasValue}
                className="absolute right-4 top-1/2 -translate-y-1/2 disabled:opacity-50">
                <Search
                  className="size-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
