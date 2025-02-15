import React from "react";
import { Button, ConfigProvider } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Room from "./pages/Room";
import CreateProfile from "./pages/CreateProfile";

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
				{/* Add other routes */}
			</Routes>
		</Router>
	</ConfigProvider>
);

export default App;
