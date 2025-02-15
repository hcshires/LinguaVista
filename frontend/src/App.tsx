import React from "react";
import { ConfigProvider } from "antd";
import { Routes, Route, HashRouter } from "react-router-dom";
import { SearchContextProvider } from "./context/SearchContext.tsx";
import { ROUTES } from "./helpers/Lang.ts";
import Home from "./pages/Home.tsx";
import Chat from "./pages/Chat.tsx";
import Notes from "./pages/Notes.tsx";

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
		<HashRouter>
			<SearchContextProvider>
				<Routes>
					<Route path={ROUTES.HOME} element={<Home />} />
					<Route path={ROUTES.CHAT} element={<Chat />} />
					<Route path={ROUTES.NOTES} element={<Notes />} />
					{/* Add other routes */}
				</Routes>
			</SearchContextProvider>
		</HashRouter>
	</ConfigProvider>
);

export default App;
