import React, { useState } from "react";
import { Layout, Button, Drawer, Avatar, Space, Image, Flex, Divider, Tag } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../helpers/Lang";
const { Header } = Layout;

const Navbar: React.FC = () => {
	const [open, setOpen] = useState(false);

	const navigate = useNavigate();

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
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
			}}>
			<Space style={{ cursor: "pointer" }} onClick={() => navigate(ROUTES.HOME)}>
				<Image src="images/logo512.png" width={30} preview={false} />
				<h1
					style={{
						background: "linear-gradient(90deg, #70b6f2, #E98887)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}>
					LinguaVista
				</h1>
			</Space>

			<Button style={{ padding: "20px 7.5px" }} onClick={showDrawer}>
				Manage Profile
				<Avatar size={30} icon={<UserOutlined />} style={{ backgroundColor: "transparent", border: "1px solid white" }} />
			</Button>
			<Drawer
				title="My Learning Profile"
				onClose={onClose}
				open={open}
				extra={
					<Button variant="outlined">
						<EditOutlined />
						Edit
					</Button>
				}>
				<Divider orientation="left">Name</Divider>
				<p>Firstname Lastname</p>
				<Divider orientation="left">Strengths</Divider>
				<Flex gap="4px 0" wrap>
					<Tag color="magenta">Spanish: Greetings</Tag>
					<Tag color="red">Geography: US Capitals</Tag>
				</Flex>
				<Divider orientation="left">Likes</Divider>
				<Flex gap="4px 0" wrap>
					<Tag color="green">Video Games</Tag>
					<Tag color="blue">Sports</Tag>
				</Flex>
				<Divider orientation="left">Dislikes</Divider>
				<Flex gap="4px 0" wrap>
					<Tag color="yellow">Vegetables</Tag>
					<Tag color="gray">Winter</Tag>
				</Flex>
				<Divider></Divider>
				<Button onClick={() => navigate(ROUTES.NOTES)}>View Progress and Notes</Button>
			</Drawer>
		</Header>
	);
};

export default Navbar;
