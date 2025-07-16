import { create } from "zustand";

const useSearchStore = create((set) => ({
  query: "",
  filterBy: "title",
  results: [],
  setQuery: (query) => set({ query }),
  setFilterBy: (filterBy) => set({ filterBy }),
  setResults: (results) => set({ results }),
}));

export default useSearchStore;
