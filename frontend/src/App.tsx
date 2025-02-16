import React, { useEffect,useRef, useState  } from "react";
import { Button, ConfigProvider } from "antd";
import Bubble from "./components/bubble";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Room from "./pages/Room";
import CreateProfile from "./pages/CreateProfile";
import GenerateImage from "./pages/Image";

const App: React.FC = () => (
	<ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
		{/* <div className="App">
			<Button type="primary">Button</Button>
		</div> */}
		<Router>
			<Routes>
				<Route path="/" element={<CreateProfile />} />
				<Route path="/home" element={<Home />} />
				<Route path="/room/:id" element={<Room />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/image" element={<GenerateImage />} />
				{/* Add other routes */}
			</Routes>
		</Router>
	</ConfigProvider>
);

export default App;
