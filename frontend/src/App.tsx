import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Room from "./pages/Room";
import { SearchContextProvider } from "./context/SearchContext";
import { ROUTES } from "./helpers/Lang";
import Notes from "./pages/Notes";

const App: React.FC = () => (
	<ConfigProvider
		theme={{
			components: {
				Button: {
					colorBgBase: "#70B6F2",
					colorBorder: "#0088ff",
					colorText: "white",
					colorBgTextHover: "white",
					algorithm: true, // Enable algorithm
					borderRadius: 4,
				},
			},
			token: {
				// Seed Token
				colorPrimary: "#70B6F2",
				borderRadius: 4,

				// Alias Token
				colorBgContainer: "white",
			},
		}}>
		<SearchContextProvider>
			<Router>
				<Routes>
					<Route path={ROUTES.HOME} element={<Home />} />
					<Route path={ROUTES.ROOM} element={<Room />} />
					<Route path={ROUTES.CHAT} element={<Chat />} />
					<Route path={ROUTES.NOTES} element={<Notes />} />
					{/* Add other routes */}
				</Routes>
			</Router>
		</SearchContextProvider>
	</ConfigProvider>
);

export default App;
