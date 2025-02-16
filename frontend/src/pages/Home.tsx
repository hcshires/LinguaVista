import React, { useState } from "react";
import { Layout, theme, Segmented, Card } from "antd";
import { SEARCH_CATEGORIES } from "../helpers/Lang.ts";
import SearchBar from "../components/SearchBar.tsx";
import Navbar from "../components/Navbar.tsx";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const Home: React.FC = () => {
	const {
		token: { borderRadiusLG },
	} = theme.useToken();
	const [searchCategory, setSearchCategory] = useState(SEARCH_CATEGORIES[0]);

    const navigate = useNavigate();

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
					// backgroundColor: "rgba(255, 255, 255, 0.9)",
					backgroundImage: "linear-gradient(rgba(211, 229, 243, 0.7), rgba(29, 116, 182, 0.7), rgba(0, 100, 167, 0.9)), url('images/background.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					// padding: "75px",
					paddingLeft: "150px",
					paddingRight: "150px",
					paddingTop: "50px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					height: "100%",
				}}>
				
				{/* <h1 style={{ fontSize: "50px", textAlign: "center", color: "white" }}>Welcome back!</h1> */}
				<h2 style={{ textAlign: "center", fontSize: "40px", fontWeight: "bold", color: "white" }}>What would you like to learn about today?</h2>
				<div
					style={{
						padding: "24px",
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
