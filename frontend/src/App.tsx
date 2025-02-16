import React, { useEffect,useRef, useState  } from "react";
import { Button, ConfigProvider } from "antd";
import Bubble from "./components/bubble";

const App: React.FC = () => {	
	return (
		<ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
			<div className="App">
				<Bubble />
			</div>
		</ConfigProvider>
	);
};

export default App;
