"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseFilter } from "./guest-filter-types";

const SEARCH_DEBOUNCE_MS = 300;

function SearchField({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    if (inputValue === query) return;

    const timeout = setTimeout(() => {
      onQueryChange(inputValue);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [inputValue, query, onQueryChange]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search guests by name..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}

export function GuestFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const filter = parseFilter(searchParams.get("filter"));

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <SearchField
        key={query}
        query={query}
        onQueryChange={(value) => updateParams({ q: value })}
      />
      <Select
        value={filter}
        onValueChange={(value) => updateParams({ filter: value })}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All guests</SelectItem>
          <SelectItem value="godfather">Godfather</SelectItem>
          <SelectItem value="godmother">Godmother</SelectItem>
          <SelectItem value="attending">Attending</SelectItem>
          <SelectItem value="not-attending">Not attending</SelectItem>
          <SelectItem value="no-response">No response</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
