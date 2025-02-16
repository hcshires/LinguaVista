import React, { useState } from "react";

const Chat = () => {
    const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const [imgPrompt, setImgPrompt] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [image, setImage] = useState("");

  const handleGenerate = async () => {
    const imageRes = await generateImage(imgPrompt);
    // if (imageRes) {
    //   setImage(image);
    // }
  };
    
  const generateImage = async (prompt: string) => {
    const response = await fetch('http://localhost:8000/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
      console.log("data", data);
      setImage(data.image);
  };

//   const generateImage = async (prompt: string) => {
//     try {
//       const response = await fetch(
//         "http://localhost:3010/api/image/generate-image",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             prompt: prompt || "A painting of a beautiful sunset",
//           }),
//         }
//       );
//       const data = await response.json();
//       return `data:image/png;base64,${data.image}`;
//     } catch (error) {
//       console.error("Error fetching image:", error);
//       return null;
//     }
//   };

  const getLlamaResponse = async (userPrompt: string) => {
    const systemPrompt =
      "You are a knowledgeable historian specializing in ancient civilizations.";
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
    e.preventDefault();
    const reply = await getLlamaResponse(prompt);
    setResponse(reply);
  };
    
    console.log("image", image);    

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Llama..."
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>

      <input
        type="text"
        value={imgPrompt}
        onChange={(e) => setImgPrompt(e.target.value)}
        placeholder="Enter prompt"
      />
      <button onClick={handleGenerate}>Generate Image</button>
          {/* {imageSrc && <img src={imageSrc} alt="Generated" />} */}
          {image && <img src={image} alt="Generated" />}
    </div>
  );
};

export default Chat;