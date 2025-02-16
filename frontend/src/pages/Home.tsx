import React, { useState } from "react";
import { Layout, theme, Segmented, Button, Drawer, Avatar } from "antd";
import { SEARCH_CATEGORIES } from "../helpers/Lang";
import SearchBar from "../components/SearchBar";
import { UserOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const Home: React.FC = () => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const [searchCategory, setSearchCategory] = useState(SEARCH_CATEGORIES[0]);

	const items = SEARCH_CATEGORIES.map((category, index) => ({
		key: String(index + 1),
		label: `${category}`,
		value: `${category}`,
	}));

	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<Layout style={{ height: "100vh" }}>
			<Header
				style={{
					position: "sticky",
					top: 0,
					zIndex: 1,
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					backgroundColor: "white",
					border: "1px solid #f2f2f2",
				}}>
				<h1>LinguaVista</h1>
				<Button style={{ padding: "20px 7.5px" }} onClick={showDrawer}>
					Manage Profile
					<Avatar size={30} icon={<UserOutlined />} />
				</Button>
				<Drawer title="My Learning Profile" onClose={onClose} open={open}>
					<p></p>
					<p>Name</p>
					<p>Strengths (Tags)</p>
					<p>Likes/Dislikes</p>
					<Button>View Progress and Notes</Button>
				</Drawer>
			</Header>
			<Content style={{ background: colorBgContainer, padding: "50px", height: "100%" }}>
				<h1 style={{ textAlign: "center" }}>Welcome back, User!</h1>
				<h3 style={{ textAlign: "center" }}>What would you like to learn?</h3>
				<div
					style={{
						padding: "24px 250px",
						borderRadius: borderRadiusLG,
						flexDirection: "row",
					}}>
					<Segmented options={items} value={searchCategory} onChange={setSearchCategory} block />
					<SearchBar />
				</div>
			</Content>
		</Layout>
	);
};

export default Home;
