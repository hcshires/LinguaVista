import React, { useState } from "react";
import { Button, Flex, Input } from "antd";

import { useSearch } from "../context/SearchContext.tsx";

const SearchBar = () => {
	const { setSearchQuery } = useSearch();
	const [search, setSearch] = useState("");

	return (
		<Flex style={{ width: "100%", margin: "25px 0" }}>
			<Input
				style={{ flex: 1, marginRight: "25px" }}
				placeholder="I want to learn..."
				onChange={(e) => setSearch(e.target.value)}
				value={search}
			/>
			<Button
				onClick={() => {
					setSearchQuery(search);
				}}>
				Search
			</Button>
		</Flex>
	);
};

export default SearchBar;
