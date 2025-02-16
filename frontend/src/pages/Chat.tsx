import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Chat: React.FC = () => {

	const [prompt, setPrompt] = useState("");
	const [response, setResponse] = useState("");

	const [imgPrompt, setImgPrompt] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    
    const location = useLocation();

    const userRequest = location.state.context as string;
    console.log("User request:", userRequest);

  const handleTranscript = async () => {
    const audioFileDir = fetch('http://localhost:8000/log')
      .then(response => {
        
        console.log("audio", response.text())
        return response.text();
      })
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));



      // const response = await fetch("http://127.0.0.1:8001/llm-result/", {
      //   method: "POST",
      //   headers: {
      //       "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //       file_path: audioFileDir,
      //   }),
      // });

      // console.log(response);
  };

	const handleGenerate = async () => {
		const image = await generateImage(imgPrompt);
		if (image) {
			setImageSrc(image);
		}
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
		// const systemPrompt = "You are a knowledgeable historian specializing in ancient civilizations.";
		// const response = await fetch("http://localhost:11434/api/chat", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		model: "llama3",
		// 		messages: [
		// 			{
		// 				role: "system",
		// 				content: systemPrompt,
		// 			},
		// 			{
		// 				role: "user",
		// 				content: userPrompt,
		// 			},
		// 		],
		// 		stream: false,
		// 	}),
		// });

		// const data = await response.json();
        // return data.message.content;
        
        const response = await fetch("http://127.0.0.1:8001/llm-result/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: userPrompt,
            }),
        });

        const data = await response.json();
        console.log(data);

        const imageResponse = await fetch("http://127.0.0.1:8001/generate/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: data.response }),
        });

        const imageData = await imageResponse.json();
        console.log(imageData);
        setImageSrc(imageData.url);

        return data.response;
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		const reply = await getLlamaResponse(prompt);
		setResponse(reply);
	};

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

      <button onClick={handleTranscript}>Transcript</button>

			<input type="text" value={imgPrompt} onChange={(e) => setImgPrompt(e.target.value)} placeholder="Enter prompt" />
			<button onClick={handleGenerate}>Generate Image</button>
			{imageSrc && <img src={imageSrc} alt="Generated" />}

      
		</div>
	);
};

export default Chat;
