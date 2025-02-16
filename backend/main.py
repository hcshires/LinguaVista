from fastapi import FastAPI, HTTPException
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

# Load the Stable Diffusion model
model_id = "CompVis/stable-diffusion-v1-4"
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {device}")
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    revision="fp16",
    torch_dtype=torch.float16,
    ).to(device)

if hasattr(torch, "compile"):
    pipe.__call__ = torch.compile(pipe.__call__)

@app.post("/generate/")
async def generate_image(request: ImageRequest):
    try:
        prompt = request.prompt
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
