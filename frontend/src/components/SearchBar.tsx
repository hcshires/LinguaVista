import React, { useState } from "react";
import { Button, Flex, Input } from "antd";

import { useSearch } from "../context/SearchContext.tsx";
import { useNavigate } from "react-router-dom";
import { useConversation } from "../context/ConversationContext.tsx";

const SearchBar = ({ category }) => {
	const { setSearchQuery } = useSearch();
	const { setCurrConvo } = useConversation();

	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	return (
		<Flex style={{ width: "100%", margin: "25px 0" }}>
			<Input
				style={{ flex: 1, marginRight: "25px" }}
				placeholder="I want to learn about..."
				onChange={(e) => setSearch(e.target.value)}
				value={search}
			/>
			<Button
				onClick={() => {
					setSearchQuery(search);
					navigate("/chat", { state: { context: category + ":" + search } });
					setCurrConvo([{ role: "context", content: "In " + category + "topic, I want to learn about " + search }]);
					localStorage.setItem("convo", JSON.stringify([{ role: "context", content: "In " + category + "topic, I want to learn about " + search }]));
				}}>
				Start Learning!
			</Button>
		</Flex>
	);
};

export default SearchBar;
