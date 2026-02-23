import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function useURLSearch(debounceMs = 500) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const searchParam = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, debounceMs);

  // 1. Sync debounced state to the URL
  useEffect(() => {
    // Bail out if the URL is already in sync with our debounced value to prevent infinite loops
    if (debouncedSearch === searchParam) return;

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearch, pathname, router, searchParam, searchParams]);

  // 2. Sync URL changes back to local state (Handles browser Back/Forward navigation)
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  return { searchInput, setSearchInput, isPending };
}
