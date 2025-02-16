import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router, Routes, Route, HashRouter } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Chat from "./pages/Chat.tsx";
import Room from "./pages/Room.tsx";
import { SearchContextProvider } from "./context/SearchContext.tsx";

const App: React.FC = () => (
	<ConfigProvider
		theme={{
			components: {
				Button: {
					colorPrimaryBgHover: "#692974", // purple
					colorBorder: "#692974",
					colorText: "#692974",
					colorBgTextHover: "white",
					algorithm: true, // Enable algorithm
					borderRadius: 4,
				},
			},
			token: {
				// Seed Token
				colorPrimary: "#692974", // purple
				colorFillSecondary: "#0DB88F", // green
				colorFillTertiary: "#1171AC", // blue
				colorFill: "#92F4F5", // light blue
				borderRadius: 4,

				// Alias Token
				colorBgContainer: "white",
			},
		}}>
		<SearchContextProvider>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/room/:id" element={<Room />} />
					<Route path="/chat" element={<Chat />} />
					{/* Add other routes */}
				</Routes>
			</HashRouter>
		</SearchContextProvider>
	</ConfigProvider>
);

export default App;
