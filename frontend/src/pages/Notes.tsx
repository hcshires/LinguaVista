import React from "react";
import { Layout, Typography, Collapse } from "antd";
import Navbar from "../components/Navbar";
import { ROUTES } from "../helpers/Lang";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

// works when >= 5.6.0, recommended ✅
const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;

const items = [
	{
		key: "1",
		label: "This is panel header 1",
		children: (
			<Typography>
				<Title>Note 1 - 2/15/2025</Title>
				<Paragraph>{text}</Paragraph>
				{/* <Image></Image> */}
			</Typography>
		),
	},
	{
		key: "2",
		label: "This is panel header 2",
		children: (
			<Typography>
				<Title>Note 1 - 2/15/2025</Title>
				<Paragraph>{text}</Paragraph>
				{/* <Image></Image> */}
			</Typography>
		),
	},
	{
		key: "3",
		label: "This is panel header 3",
		children: (
			<Typography>
				<Title>Note 1 - 2/15/2025</Title>
				<Paragraph>{text}</Paragraph>
				{/* <Image></Image> */}
			</Typography>
		),
	},
	{
		key: "4",
		label: "This is panel header 3",
		children: (
			<Typography>
				<Title>Note 1 - 2/15/2025</Title>
				<Paragraph>{text}</Paragraph>
				{/* <Image></Image> */}
			</Typography>
		),
	},
	{
		key: "5",
		label: "This is panel header 3",
		children: (
			<Typography>
				<Title>Note 1 - 2/15/2025</Title>
				<Paragraph>{text}</Paragraph>
				{/* <Image></Image> */}
			</Typography>
		),
	},
];

const Notes: React.FC = () => {
	return (
		<Layout style={{ height: "100vh", backgroundColor: "white" }}>
			<Navbar />
			<Content
				style={{
					backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('images/background.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					height: "250px",
				}}>
				<h1 style={{ fontSize: "4em", textAlign: "center" }}>My Progress and Notes</h1>
			</Content>
			<Content style={{ margin: "75px", height: "100%" }}>
				<Collapse items={items} defaultActiveKey={["1"]} />
			</Content>
		</Layout>
	);
};

export default Notes;
