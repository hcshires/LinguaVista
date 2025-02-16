import React, { useState, useRef, useEffect, useMemo } from "react";
import { Layout, Typography, Card, Flex } from "antd";
import { LeftCircleOutlined, MenuOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversation } from "../context/ConversationContext";
import { Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Comment } from "@ant-design/compatible/";

const { Content } = Layout;
const { Title } = Typography;

const Chat: React.FC = () => {
  const {
    currConvo,
    setCurrConvo,
    appendConvo,
    // If you added this helper to your context, you can use it instead.
    // addConversationEntry,
  } = useConversation();

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

  const navigate = useNavigate();
//   const location = useLocation();

//   const userRequest = location.state.context as string;
//   console.log("User request:", userRequest);

  // Handler to fetch transcript data and update conversation history
  const handleTranscript = async () => {
    // 1. Get the audio file directory
    const audioFileDir = await fetch("http://localhost:8000/log")
      .then((response) => response.text())
      .then((data) => {
        console.log("Audio file directory:", data);
        return data;
      });

    // 2. Process user audio to get transcript text
    const userTranscript = await fetch("http://127.0.0.1:8001/process_audio/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_path: audioFileDir,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User transcript data:", data);
        return data.message;
      });
    console.log("User transcript:", userTranscript);

    // 3. Append the user transcript to the conversation state
    setCurrConvo((prev) => [
      ...prev,
      { role: "user", content: userTranscript },
    ]);
    // If using an addConversationEntry helper:
    // addConversationEntry({ role: "user", content: userTranscript });

    // 4. Fetch the tutor (assistant) response based on the user transcript
    const tutorTranscript = await fetch("http://127.0.0.1:8001/llm-result/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: userTranscript,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Tutor transcript data:", data);
        return data.message[data.message.length - 1].content;
      });
    console.log("Tutor transcript:", tutorTranscript);

    // 5. Append the tutor transcript to the conversation state
    setCurrConvo((prev) => [
      ...prev,
      { role: "assistant", content: tutorTranscript },
    ]);
    // Or using helper:
    // addConversationEntry({ role: "assistant", content: tutorTranscript });

    // 6. (Optional) Generate an image based on the tutor transcript
    const imageResponse = await fetch("http://127.0.0.1:8001/generate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: tutorTranscript }),
    });
    const imageData = await imageResponse.json();
    console.log("Image data:", imageData);
    setImageSrc(imageData.url);
  };

  const handleGenerate = async () => {
    if (currConvo.length > 1) {
      appendConvo();
    }
    // Optionally, generate an image using imgPrompt
    // const image = await generateImage(imgPrompt);
    // if (image) {
    //   setImageSrc(image);
    // }
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
    const response = await fetch("http://127.0.0.1:8000/llm-result/", {
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

    const imageResponse = await fetch("http://127.0.0.1:8000/generate/", {
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

  // For testing purposes, handleSubmit just adds a dummy conversation entry
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setCurrConvo((prev) =>
      prev.concat({
        role: Math.random() > 0.5 ? "user" : "assistant",
        content: "in yo face sucka",
      })
    );
  };

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
    <div>
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

        <button onClick={handleTranscript}>Get Transcript</button>

        <input
          type="text"
          value={imgPrompt}
          onChange={(e) => setImgPrompt(e.target.value)}
          placeholder="Enter prompt"
        />
        <button onClick={handleGenerate}>Generate Image</button>
        {imageSrc && <img src={imageSrc} alt="Generated" />}
      </div>
      <Layout style={{ height: "100vh", display: "flex", backgroundColor: "#A9A9A9" }}>
        <Layout style={{ backgroundColor: "#A9A9A9" }}>
          <Content style={{ height: "100%", marginTop: 24 }}>
            <Flex dir="row" flex={1} justify="flex-start" align="flex-start">
              <LeftCircleOutlined
                style={{ padding: "12px 36px", color: "red", fontSize: 36 }}
                onClick={() => {
                  navigate("/");
                  appendConvo();
                }}
              />
              <Card style={{ flex: 1, backgroundColor: "green" }} />
              <MenuOutlined
                style={{
                  padding: "12px 36px",
                  borderWidth: 1,
                  borderColor: "black",
                  color: "black",
                  fontSize: 36,
                }}
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
                }
              >
                <video width={300} playsInline ref={userVidRef} autoPlay muted />
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
                }
              >
                <video width={300} playsInline ref={userVidRef2} autoPlay muted />
              </div>
            </Flex>
          </Footer>
        </Layout>
        <Sider
          trigger={null}
          collapsed={viewTranscript}
          collapsible={true}
          collapsedWidth={0}
          width={300}
          reverseArrow={true}
        >
          <Flex
            vertical
            style={{ height: "100%", backgroundColor: "white", padding: 24 }}
            justify="flex-start"
          >
            <Title style={{ textAlign: "center" }}>Transcript</Title>
            {currConvo.map((convo, index) => (
              <Comment
                key={index}
                author={convo.role}
                content={
                  <div
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#f0f0f0",
                      borderRadius: "16px",
                      display: "inline-block",
                    }}
                  >
                    {convo.content}
                  </div>
                }
              />
            ))}
          </Flex>
        </Sider>
      </Layout>
    </div>
  );
};

export default Chat;
