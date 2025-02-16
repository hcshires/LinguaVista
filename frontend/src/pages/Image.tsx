import React, { useState } from "react";

const GenerateImage = () => {
    const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Generate Image</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>
      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Generated Image:</h2>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default GenerateImage;