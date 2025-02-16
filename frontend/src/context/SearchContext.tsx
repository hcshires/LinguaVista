import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { SEARCH_CATEGORIES } from "../helpers/Lang.ts";
import { useNavigate } from "react-router-dom";

const SearchContext = createContext<any | null>(null);

const SearchContextProvider = ({ children }: { children: any }) => {
	const [searchCategory, setSearchCategory] = useState(SEARCH_CATEGORIES[0]);
	const [searchQuery, setSearchQuery] = useState("");

	const SearchContextValue = useMemo(
		() => ({
			searchCategory,
			searchQuery,
			setSearchCategory,
			setSearchQuery,
		}),
		[searchCategory, searchQuery]
	);

	return <SearchContext.Provider value={SearchContextValue}>{children}</SearchContext.Provider>;
};

const useSearch = () => useContext(SearchContext);

export { SearchContext, SearchContextProvider, useSearch };
