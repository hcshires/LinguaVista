import React, { useState } from "react";
import { Layout, theme, Segmented, Card } from "antd";
import { SEARCH_CATEGORIES } from "../helpers/Lang.ts";
import SearchBar from "../components/SearchBar.tsx";
import Navbar from "../components/Navbar.tsx";

const { Content } = Layout;

const Home: React.FC = () => {
	const {
		token: { borderRadiusLG },
	} = theme.useToken();
	const [searchCategory, setSearchCategory] = useState(SEARCH_CATEGORIES[0]);

	const items = SEARCH_CATEGORIES.map((category, index) => ({
		key: String(index + 1),
		label: `${category}`,
		value: `${category}`,
	}));

	return (
		<Layout style={{ height: "100vh" }}>
			<Navbar />
			<Content
				style={{
					backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('images/background.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					padding: "75px",
					height: "100%",
				}}>
				<h1 style={{ fontSize: "4em", textAlign: "center" }}>Welcome back, User!</h1>
				<h2 style={{ textAlign: "center" }}>What would you like to learn about?</h2>
				<div
					style={{
						padding: "24px 250px",
						borderRadius: borderRadiusLG,
						flexDirection: "row",
					}}>
					<Card>
						<Segmented options={items} value={searchCategory} onChange={setSearchCategory} block />
						<SearchBar />
					</Card>
				</div>
			</Content>
		</Layout>
	);
};

export default Home;
