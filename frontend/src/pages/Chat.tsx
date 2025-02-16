import React, { useState, useRef, useEffect, useMemo } from "react";
import { Layout, theme, Segmented, Card, Flex } from "antd";
import { LeftCircleOutlined, MenuOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useConversation } from "../context/ConversationContext";
import { Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

const { Content } = Layout;

const Chat: React.FC = () => {
	const { currConvo, setAllConvos, setCurrConvo, appendConvo } = useConversation();

	const [prompt, setPrompt] = useState("");
	const [response, setResponse] = useState("");

	const [imgPrompt, setImgPrompt] = useState("");
	const [imageSrc, setImageSrc] = useState("");

	const [viewTranscript, setViewTranscript] = useState(true);
	const [volume, setVolume] = useState(0);
	const [aiActive, setAiActive] = useState(false);
	const userActive = useMemo(() => !aiActive && volume > 20, [volume, aiActive]);

	const userVidRef = useRef(null);
	const userVidRef2 = useRef(null);

	const location = useLocation();

	const userRequest = location.state.context as string;
	console.log("User request:", volume);

	const handleGenerate = async () => {
		if (currConvo.length > 1) {
			appendConvo();
		}
		/*const image = await generateImage(imgPrompt);
		if (image) {
			setImageSrc(image);
		}*/
	};

	const generateImage = async (prompt: string) => {
		try {
			const response = await fetch("http://localhost:3010/api/image/generate-image", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt: prompt || "A painting of a beautiful sunset",
				}),
			});
			const data = await response.json();
			return `data:image/png;base64,${data.image}`;
		} catch (error) {
			console.error("Error fetching image:", error);
			return null;
		}
	};

	const getLlamaResponse = async (userPrompt: string) => {
		const systemPrompt = "You are a knowledgeable historian specializing in ancient civilizations.";
		const response = await fetch("http://localhost:11434/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "llama3",
				messages: [
					{
						role: "system",
						content: systemPrompt,
					},
					{
						role: "user",
						content: userPrompt,
					},
				],
				stream: false,
			}),
		});

		const data = await response.json();
		return data.message.content;
	};

	const handleSubmit = async (e: any) => {
		setCurrConvo(currConvo.concat({ role: Math.random() > 0.5 ? "user" : "assistant", content: "in yo face sucka" }));
		e.preventDefault();
		//const reply = await getLlamaResponse(prompt);
		//setResponse(reply);
	};
	/*
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask Llama..." />
				<button type="submit">Send</button>
			</form>
			<div>
				<h3>Response:</h3>
				<p>{response}</p>
			</div>

			<input type="text" value={imgPrompt} onChange={(e) => setImgPrompt(e.target.value)} placeholder="Enter prompt" />
			<button onClick={handleGenerate}>Generate Image</button>
			{imageSrc && <img src={imageSrc} alt="Generated" />}
		</div>
	);*/
	const handleStream = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});

		if (userVidRef.current) {
			userVidRef.current.srcObject = stream;
			userVidRef2.current.srcObject = stream;
		}
	};

	useEffect(() => {
		if (userVidRef && !userVidRef.current.srcObject) {
			handleStream();
		}
		let audioContext;
		let analyser;
		let microphone;
		let dataArray;
		let animationFrameId;

		const getMicrophone = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

				audioContext = new window.AudioContext();
				analyser = audioContext.createAnalyser();
				microphone = audioContext.createMediaStreamSource(stream);
				analyser.fftSize = 256; // Frequency resolution
				const bufferLength = analyser.frequencyBinCount;
				dataArray = new Uint8Array(bufferLength);

				microphone.connect(analyser);

				const updateVolume = () => {
					analyser.getByteFrequencyData(dataArray);
					const sum = dataArray.reduce((acc, val) => acc + val, 0);
					const avgVolume = sum / bufferLength; // Normalize volume
					setVolume(avgVolume);
					animationFrameId = requestAnimationFrame(updateVolume);
				};

				updateVolume();
			} catch (err) {
				console.error("Microphone access denied", err);
			}
		};

		getMicrophone();

		return () => {
			if (audioContext) {
				audioContext.close();
			}
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, []);

	return (
		<Layout style={{ height: "100vh", display: "flex", backgroundColor: "#A9A9A9" }}>
			<Layout style={{ backgroundColor: "#A9A9A9" }}>
				<Content style={{ height: "100%", marginTop: 24 }}>
					<Flex dir="row" flex={1} justify="flex-start" align="flex-start">
						<LeftCircleOutlined style={{ padding: "12px 36px", color: "red", fontSize: 36 }} />
						<Card style={{ flex: 1, backgroundColor: "green" }} />
						<MenuOutlined
							style={{ padding: "12px 36px", borderWidth: 1, borderColor: "black", color: "black", fontSize: 36 }}
							onClick={() => {
								setViewTranscript(!viewTranscript);
							}}
						/>
					</Flex>
				</Content>
				<Footer style={{ backgroundColor: "grey" }}>
					<Flex flex={1} dir="row" justify="space-evenly">
						<div
							style={
								userActive
									? {
											backgroundColor: "#0eab1d",
											width: 310,
											height: 235,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
									  }
									: {
											backgroundColor: "transparent",
											width: 310,
											height: 235,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
									  }
							}>
							<video width={300} playsInline ref={userVidRef} autoPlay />
						</div>
						<div
							style={
								aiActive
									? {
											backgroundColor: "#0eab1d",
											width: 310,
											height: 235,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
									  }
									: {
											backgroundColor: "transparent",
											width: 310,
											height: 235,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
									  }
							}>
							<video width={300} playsInline ref={userVidRef2} autoPlay />
						</div>
					</Flex>
				</Footer>
			</Layout>
			<Sider trigger={null} collapsed={viewTranscript} collapsible={true} collapsedWidth={0} width={300} reverseArrow={true} />
		</Layout>
	);
};

export default Chat;
