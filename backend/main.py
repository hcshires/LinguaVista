from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from diffusers import StableDiffusionPipeline
import torch
import os
import uuid
from pydantic import BaseModel

app = FastAPI()

class ImageRequest(BaseModel):
    prompt: str
    num_inference_steps: int = 20  # Changed default from 50 to 20
    guidance_scale: float = 7.5
    
class AudioFileRequest(BaseModel):
    file_path: str

class LlmRequest(BaseModel):
    prompt: str
    # system_message: str

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store temporary images
IMAGE_DIR = "temp_images"
os.makedirs(IMAGE_DIR, exist_ok=True)

# Mount the static directory to serve generated images
app.mount("/images", StaticFiles(directory=IMAGE_DIR), name="images")

@app.post("/generate/")
async def generate_image(request: ImageRequest):
    # Load the Stable Diffusion model
    model_id = "CompVis/stable-diffusion-v1-4"
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"Using defvice: {device}")
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id,
        revision="fp16",
        torch_dtype=torch.float16,
        ).to(device)

    if hasattr(torch, "compile"):
        pipe.__call__ = torch.compile(pipe.__call__)

    try:
        # prompt = request.prompt
        # Generate image from prompt
        # image = pipe(prompt).images[0]
        output = pipe(
            request.prompt,
            num_inference_steps=request.num_inference_steps,
            guidance_scale=request.guidance_scale
        )
        image = output.images[0]
        # Save the image with a unique filename
        filename = f"{uuid.uuid4()}.png"
        file_path = os.path.join(IMAGE_DIR, filename)
        image.save(file_path, format="PNG")
        # Construct the URL (adjust host/port as needed)
        image_url = f"http://127.0.0.1:8000/images/{filename}"
        return {"url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# MARK: - Audio Processing
import asyncio
import websockets
import wave
import base64
import json
# time 
import time


class AudioProcessor:
    def __init__(self):
        self.audio_data = []
        # start time
        self.start_time = time.time()

    async def process_audio(self, audio_data):
        # processed as base64_encoded_audio_chunk 
        # decode base64
        content = json.loads(audio_data)
        audio_data = base64.b64decode(content["content"]["data"])
        self.audio_data.append(audio_data)
        
        # if 5 seconds have passed, save the audio data to a file
        if time.time() - self.start_time > 5:
            print(audio_data)
            self.convert_to_audio_file()
            self.start_time = time.time()
            import sys
            print("Exiting")
            sys.exit()
        
        return {"status": "processed", "data": audio_data}

    def convert_to_audio_file(self, filename="output.wav"):
        with wave.open(filename, 'wb') as wf:
            # Set the parameters for the WAV file
            wf.setnchannels(1)  # Mono
            wf.setsampwidth(2)  # Sample width in bytes
            wf.setframerate(44100)  # Frame rate (samples per second)
            
            # Write the audio data to the file
            for data in self.audio_data:
                wf.writeframes() 
        
        # Clear the audio data after saving
        self.audio_data = []

class AudioWorker:
    def __init__(self, websocket_url="ws://localhost:8081/audio"):
        self.websocket_url = websocket_url
        self.processor = AudioProcessor()
        
    async def handle_messages(self):
        while True:
            try:
                async with websockets.connect(self.websocket_url) as websocket:
                    print(f"Connected to {self.websocket_url}")
                    
                    while True:
                        try:
                            # Receive audio data from websocket
                            message = await websocket.recv()
                            print("test")   
                            
                            # Process the audio data
                            result = await self.processor.process_audio(message)
                            
                            # You can add handling of results here
                            print("Processed audio data:", result)
                            
                        except websockets.ConnectionClosed:
                            print("Connection lost, attempting to reconnect...")
                            break
                            
            except Exception as e:
                print(f"Connection error: {e}")
                print("Retrying in 5 seconds...")
                await asyncio.sleep(5)

async def user_audio_processing():
    print("doing audio processing")
    worker = AudioWorker()
    await worker.handle_messages()

# endpnt where you input a file name 
@app.post("/process_audio/")
async def process_audio(request: AudioFileRequest):
    print("received audio processing request", request.file_path)
    try:
        with open(request.file_path, "rb") as f:
            print("opened file", request.file_path)
            
            # Transcribe the audio file
            transcription = transcribe_audio(request.file_path)
            
            # Ask the LLM to answer the transcription
            await answer(transcription["text"])
        return {"status": "success", "message": f"Processed file: {request.file_path}"}
    except Exception as e:
        print("fail")
        raise HTTPException(status_code=500, detail=str(e))


# coqui TTS
from RealtimeTTS import TextToAudioStream, CoquiEngine
def say(text, stream):
    print("saying", text)
    def dummy_generator():
        yield text 
    stream.feed(dummy_generator()).play(log_synthesized_text=False)

# Llama LLM
from ollama import AsyncClient
async def stream_llm(cached_conversation, n, prompt, system_message=""):
    """Stream text from LLM"""
    message = {
        "role": "user",
        "content": prompt
    }
    
    system_message = {
        "role": "system",
        "content": f"You are a friendly and warm conversation partner with a passion for {"Japanese"} culture. Keep it very concise and short, no more than 50 words! Engage in natural dialogue with the user—ask follow-up questions, share personal insights, and respond as if you were talking to a close friend. Keep your tone relaxed, genuine, and spontaneous, avoiding overly formal or mechanical language." + system_message
    }
    
    if len(cached_conversation) == n:
        cached_conversation.pop(0)
    cached_conversation.append(message)
    async for part in await AsyncClient().chat(
        model="llama3", messages=cached_conversation, stream=True
    ):
        yield part["message"]["content"]
        
async def answer(prompt): 
    n = 2
    cached_conversation = []
    engine = CoquiEngine()
    stream = TextToAudioStream(engine)
    print("answering", prompt)
    # Buffer for accumulating text
    buffer = ""
    
    # Stream from LLM and feed to TTS
    full_text = ""
    async for chunk in stream_llm(cached_conversation, n, prompt):
        buffer += chunk
        
        # Speak when we have a complete sentence
        if any(punct in buffer for punct in '.!?'):
            # Split at first sentence-ending punctuation
            to_speak, buffer = buffer.split('.', 1) if '.' in buffer else \
                             buffer.split('!', 1) if '!' in buffer else \
                             buffer.split('?', 1)
            
            # Add punctuation back and speak
            say(to_speak + '.', stream)
            
            full_text += to_speak + '.'
    if len(cached_conversation) == n:
        cached_conversation.pop(0)
    cached_conversation.append({"role": "assistant", "content": full_text})
    return cached_conversation

@app.post("/llm-result/")
async def get_llm_result(request: LlmRequest, background_tasks: BackgroundTasks):
    print("received llm request", request.prompt)
    result = await answer(request.prompt)
    print("llm result", result)
    background_tasks.add_task(asyncio.run, result)
    # background_tasks.add_task(generate_image, ImageRequest(prompt=result))
    return {"status": "success", "message": result}
    

# Speechto text (Whisper)
import subprocess
import json
import os
from typing import Optional

def transcribe_audio(audio_file_path: str) -> Optional[dict]:
    """
    Transcribe audio using insanely-fast-whisper in whisper_env environment
    """
    try:
        # Get the path to the conda/whisper_env Python interpreter
        whisper_python = "/Users/brayton/opt/anaconda3/envs/whisper_env/bin/python"
        
        if not os.path.exists(audio_file_path):
            print(f"Audio file not found: {audio_file_path}")
            return None

        # Run the whisper command in the specific environment
        command = [
            "/Users/brayton/opt/anaconda3/envs/whisper_env/bin/insanely-fast-whisper",
            "--file-name", audio_file_path,
            "--device-id", "mps",
            "--model-name", "openai/whisper-small",
            "--batch-size", "64",
            "--transcript-path", "transcript.json"
        ]
        
        print("Starting transcription...")
        env = os.environ.copy()
        env["PATH"] = f"/Users/brayton/opt/anaconda3/envs/whisper_env/bin:{env['PATH']}"
        
        result = subprocess.run(command, capture_output=True, text=True, env=env)
        
        if result.returncode != 0:
            print(f"Error during transcription: {result.stderr}")
            return None
            
        try:
            with open("transcript.json", 'r') as f:
                transcription = json.load(f)
                
            # os.remove("transcript.json")
            print("Transcription complete")
            return transcription
            
        except FileNotFoundError:
            print("Transcription file not found")
            return None
        except json.JSONDecodeError:
            print("Error parsing transcription file")
            return None
            
    except Exception as e:
        print(f"Transcription failed: {str(e)}")
        return None
 

if __name__ == "__main__":
    import uvicorn
    engine = CoquiEngine()
    stream = TextToAudioStream(engine)
    n = 2
    cached_conversation = []
    
    # testtranscribe 
    # fname = "/Users/brayton/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Visual Studio Projects/Hackathons/TreeHacks25/LinguaVista/backend/recordings/ULhvT3WEBT6Srse3TgWRGx/audio.mp3"  
    # transcription = transcribe_audio(fname)

    # asyncio.run(user_audio_processing())
    # print("Starting FastAPI server")
    # say("Hi there. This is a pretty long sentence not sayiooong anything just to test.")
    # asyncio.run(answer("Tell me an interesting fact about elephants"))  
    # asyncio.run(answer("can you summarize the previous answer in one sentence?"))  
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
