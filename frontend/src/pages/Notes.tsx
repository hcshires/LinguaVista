import React from "react";
import { Layout, Typography, Collapse } from "antd";
import Navbar from "../components/Navbar.tsx";
import { useConversation } from "../context/ConversationContext.tsx";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

// works when >= 5.6.0, recommended ✅
const texts = {
	"1": "Student: I'm traveling to Japan next week. Can you teach me how to order at a restaurant?\n\nAI: Of course! Let's start with a basic phrase. \"Menyu o kudasai\" means \"Please give me the menu.\"\n[Generated image: Japanese restaurant menu]\n\nStudent: How do I ask for the chef's recommendation?\n\nAI: You can say \"Osusume wa nan desu ka?\" Let me show you a typical chef's special dish.\n[Generated image: Japanese chef's special sushi platter]\n\nStudent: Perfect! How do I say \"This is delicious\"?\n\nAI: \"Oishii desu!\" You can use this for any food you enjoy.\n[Generated image: Various Japanese dishes with \"おいしいです\" text overlay]",
  
	"2": "Student: I'm new to React. Can you explain what components are?\n\nAI: Let me show you a simple component structure.\n[Generated image: Component tree diagram]\n\nStudent: How do props work?\n\nAI: Props are like passing data between components. Let me visualize this.\n[Generated image: Data flow diagram with props]\n\nStudent: Can you show me a practical example?\n\nAI: Here's a simple button component receiving props.\n[Generated image: Code snippet with visual data flow]",
  
	"3": "Student: Can you explain photosynthesis simply?\n\nAI: Let's break it down visually. Plants take in sunlight, water, and CO2.\n[Generated image: Simple photosynthesis diagram]\n\nStudent: What happens inside the leaf?\n\nAI: The chloroplasts in the leaf cells process these ingredients.\n[Generated image: Closeup of leaf cell structure]\n\nStudent: What's the end result?\n\nAI: The plant produces glucose for energy and releases oxygen.\n[Generated image: End products with arrows]",
  
	"4": "Student: What exactly is a derivative?\n\nAI: A derivative shows the rate of change. Let me show you visually.\n[Generated image: Graph with tangent line]\n\nStudent: How do you find the derivative of a curve?\n\nAI: It's like finding the slope at each point. Watch this.\n[Generated image: Animation of slope changing along curve]\n\nStudent: Can you show a real-world example?\n\nAI: Here's how derivatives calculate a car's speed from position.\n[Generated image: Position vs. velocity graphs]",
  
	"5": "Student: Can you tell me about Diwali?\n\nAI: Diwali is the festival of lights in India. Let me show you.\n[Generated image: Diwali celebration with diyas]\n\nStudent: What do people usually do during Diwali?\n\nAI: Families light lamps, share sweets, and celebrate together.\n[Generated image: Traditional Diwali customs]\n\nStudent: What about the decorations?\n\nAI: Homes are decorated with rangoli patterns and lights.\n[Generated image: Colorful rangoli design]"
  };
  
  const items = [
	{
	  key: "1",
	  label: "Japanese Restaurant Conversation",
	  children: (
		<Typography>
		  <Title>Japanese Dining - 2/15/2025</Title>
		  <Paragraph>{texts["1"]}</Paragraph>
		</Typography>
	  ),
	},
	{
	  key: "2",
	  label: "React Components Tutorial",
	  children: (
		<Typography>
		  <Title>React Basics - 2/15/2025</Title>
		  <Paragraph>{texts["2"]}</Paragraph>
		</Typography>
	  ),
	},
	{
	  key: "3",
	  label: "Photosynthesis Explained",
	  children: (
		<Typography>
		  <Title>Biology Basics - 2/15/2025</Title>
		  <Paragraph>{texts["3"]}</Paragraph>
		</Typography>
	  ),
	},
	{
	  key: "4",
	  label: "Understanding Derivatives",
	  children: (
		<Typography>
		  <Title>Calculus Introduction - 2/15/2025</Title>
		  <Paragraph>{texts["4"]}</Paragraph>
		</Typography>
	  ),
	},
	{
	  key: "5",
	  label: "Learning About Diwali",
	  children: (
		<Typography>
		  <Title>Cultural Exchange - 2/15/2025</Title>
		  <Paragraph>{texts["5"]}</Paragraph>
		</Typography>
	  ),
	},
  ];
  

const Notes: React.FC = () => {
	const { convoItems } = useConversation();

	console.log(convoItems());

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
