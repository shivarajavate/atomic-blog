import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext();

function SearchContextProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  const value = useMemo(() => {
    return {
      searchQuery,
      setSearchQuery,
    };
  }, [searchQuery, setSearchQuery]);

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

function useSearchContext() {
  return useContext(SearchContext);
}

export { SearchContextProvider, useSearchContext };
