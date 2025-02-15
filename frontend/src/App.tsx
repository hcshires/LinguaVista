import React from "react";
import { Button, ConfigProvider } from "antd";

const App: React.FC = () => (
	<ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
		<div className="App">
			<Button type="primary">Button</Button>
		</div>
	</ConfigProvider>
);

export default App;
