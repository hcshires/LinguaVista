import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

const loadChatHistory = (): ChatMessage[] => {
	const data = localStorage.getItem("chatHistory");
	if (data) {
		try {
			return JSON.parse(data) as ChatMessage[];
		} catch (error) {
			console.error("Error parsing chat history:", error);
		}
	}
	return [
		{
			role: "system",
			content: `You are a friendly and warm conversation partner with a passion for ${"Japanese"} culture. Keep it very concise and short, no more than 50 words! Engage in natural dialogue with the user—ask follow-up questions, share personal insights, and respond as if you were talking to a close friend. Keep your tone relaxed, genuine, and spontaneous, avoiding overly formal or mechanical language.`,
		},
	];
};

const saveChatHistory = (history: ChatMessage[]): void => {
	try {
		localStorage.setItem("chatHistory", JSON.stringify(history));
	} catch (error) {
		console.error("Error saving chat history:", error);
	}
};

const Chat: React.FC = () => {
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>(loadChatHistory());
	const [prompt, setPrompt] = useState<string>("");
	const [response, setResponse] = useState<string>("");
	const [imgPrompt, setImgPrompt] = useState<string>("");
	const [imageUrl, setImageUrl] = useState<string>(""); // new image URL state
	const [loading, setLoading] = useState<boolean>(false);
	const [imgLoading, setImgLoading] = useState<boolean>(false);

	useEffect(() => {
		saveChatHistory(chatHistory);
	}, [chatHistory]);

	const generateImage = async (prompt: string): Promise<void> => {
		setImgLoading(true);
		try {
			const response = await fetch("http://127.0.0.1:8000/generate/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt }),
			});
			const data = await response.json();
			setImageUrl(data.url); // note: using data.url per your new logic
		} catch (error) {
			console.error("Error generating image:", error);
		}
		setImgLoading(false);
	};

	const extractVisualKeywords = async (reply: string): Promise<string> => {
		const extractionPrompt = `Extract any key visual keywords or phrases from the following text that could be used as prompts for an image generation model, it should contain the location, event and objects if possible. If none exist, return an empty string.

Text:
${reply}`;
		const res = await fetch("http://localhost:11434/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: "llama3",
				messages: [{ role: "user", content: extractionPrompt }],
				stream: false,
			}),
		});
		const data = await res.json();
		return data.message.content as string;
	};

	const getLlamaResponse = async (userPrompt: string): Promise<string> => {
		const newHistory: ChatMessage[] = [...chatHistory, { role: "user", content: userPrompt }];
		const res = await fetch("http://localhost:11434/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: "llama3",
				messages: newHistory,
				stream: false,
			}),
		});
		const data = await res.json();
		return data.message.content as string;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setLoading(true);

		const reply = await getLlamaResponse(prompt);

		setChatHistory((prev) => [...prev, { role: "user", content: prompt }, { role: "assistant", content: reply }]);
		setResponse(reply);
		setPrompt("");
        setLoading(false);
        
        if (reply.trim() !== "") {
            generateImage(reply);
        }

		// extractVisualKeywords(reply)
		// 	.then((keywords) => {
		// 		console.log("Extracted keywords:", keywords);
		// 		if (keywords.trim() !== "") {
		// 			// Trigger image generation if we got keywords.
		// 			generateImage(keywords);
		// 		}
		// 	})
		// 	.catch((error) => console.error("Error extracting keywords:", error));
	};

	const handleGenerateImage = async (): Promise<void> => {
		if (imgPrompt.trim() !== "") {
			await generateImage(imgPrompt);
		}
	};

	return (
		<div style={{ padding: "1rem" }}>
			<div style={{ marginTop: "1rem" }}>
				<h3>Conversation History:</h3>
				<ul style={{ listStyleType: "none", padding: 0 }}>
					{chatHistory.map((msg, index) => msg.role != "system" && (
						<li key={index} style={{ marginBottom: "1rem" }}>
                            <strong>{msg.role === "user" ? "You" : "Llama"}:</strong>
							<div style={{ marginTop: "0.5rem" }}>
								<ReactMarkdown>{msg.content}</ReactMarkdown>
							</div>
						</li>
					))}
				</ul>
			</div>

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Ask Llama..."
					style={{ width: "80%", marginRight: "1rem" }}
				/>
				<button type="submit" disabled={loading}>
					{loading ? "Sending..." : "Send"}
				</button>
			</form>

			<div style={{ marginTop: "1rem" }}>
				<input
					type="text"
					value={imgPrompt}
					onChange={(e) => setImgPrompt(e.target.value)}
					placeholder="Enter image prompt..."
					style={{ width: "300px", marginRight: "10px" }}
				/>
				<button onClick={handleGenerateImage} disabled={imgLoading}>
					{imgLoading ? "Generating..." : "Generate"}
				</button>
			</div>

			<div style={{ marginTop: "1rem" }}>
				{imgLoading && <p>Generating image...</p>}
				{imageUrl && !imgLoading && (
					<div>
						<h2>Generated Image:</h2>
						<img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Chat;
