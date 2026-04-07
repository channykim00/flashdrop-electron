import { create } from "zustand";

export type FilterOptionType = "title" | "file" | "sender";

export interface SearchResult {
  uniqueUrl?: string;
  title?: string;
  fileId?: string;
  originalFilename?: string;
  senderName?: string;
}

interface SearchStore {
  query: string;
  filterBy: FilterOptionType;
  results: SearchResult[];
  setQuery: (_query: string) => void;
  setFilterBy: (_filterBy: FilterOptionType) => void;
  setResults: (_results: SearchResult[]) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  filterBy: "title",
  results: [],
  setQuery: (query) => set({ query }),
  setFilterBy: (filterBy) => set({ filterBy }),
  setResults: (results) => set({ results }),
}));

export default useSearchStore;
