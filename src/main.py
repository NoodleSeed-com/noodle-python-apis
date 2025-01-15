from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from vertexai.preview.vision_models import ImageGenerationModel
import time
import logging
from io import BytesIO
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
import os

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file")
supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI(
    title="Noodle Python APIs",
    description="Backend APIs for Noodle services",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    prompt: str

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

@app.post("/generate_image/")
async def generate_image(prompt: Prompt, request: Request):
    try:
        logger.info(f"Processing image generation request for prompt: {prompt.prompt[:50]}...")
        # Check cache first
        cache_result = supabase.table("generated_images") \
            .select("image_url") \
            .eq("prompt_hash", prompt.prompt) \
            .execute()
        
        if cache_result.data:
            # Return cached image
            image_url = cache_result.data[0]["image_url"]
            return {"image_url": image_url}
        
        # Generate new image if not in cache
        max_retries = 3
        retry_delay = 1  # seconds
        
        for attempt in range(max_retries):
            try:
                model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")  # Using standard model instead of fast
                response = model.generate_images(
                    prompt=prompt.prompt,
                    number_of_images=1,
                    language="en",
                    aspect_ratio="1:1",
                    safety_filter_level="block_some"
                )
                break
            except Exception as e:
                if attempt == max_retries - 1:
                    logger.error(f"Failed to generate image after {max_retries} attempts: {str(e)}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Image generation failed: {str(e)}"
                    )
                logger.warning(f"Attempt {attempt + 1} failed, retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
        image_bytes = response.images[0]._image_bytes
        
        # Store in Supabase
        image_id = str(uuid.uuid4())
        file_path = f"{image_id}.png"
        
        # Upload to storage first
        storage_response = supabase.storage.from_("generated-images") \
            .upload(file_path, image_bytes, {"content-type": "image/png"})
        
        if not storage_response:
            raise HTTPException(status_code=500, detail="Failed to upload image to storage")
        
        # Get public URL only after successful upload
        image_url = supabase.storage.from_("generated-images") \
            .get_public_url(file_path)
        
        # Store in cache only after successful storage upload
        cache_response = supabase.table("generated_images").insert({
            "prompt_hash": prompt.prompt,
            "image_url": image_url
        }).execute()
        
        if not cache_response.data:
            # If cache insert fails, try to clean up the uploaded file
            supabase.storage.from_("generated-images").remove([file_path])
            raise HTTPException(status_code=500, detail="Failed to store image metadata")
        
        return {"image_url": image_url}
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error occurred: {str(e)}"
        )
