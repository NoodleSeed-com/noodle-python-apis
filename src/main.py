from fastapi import FastAPI, HTTPException, Request, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import time
import logging
from io import BytesIO
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
import os
import requests
import base64
import json

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
stability_api_key = os.getenv("STABILITY_API_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file")
if not stability_api_key:
    raise ValueError("STABILITY_API_KEY must be set in .env file")

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

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

@app.post("/generate_image/")
async def generate_image(
    request: Request,
    subject: str = Form(...),
    style: str = Form(default=None),
    context: str = Form(default=None)
):
    try:
        # Construct the full prompt from the components
        prompt_parts = [subject]
        if style:
            prompt_parts.append(style)
        if context:
            prompt_parts.append(f"for {context}")
        
        full_prompt = ", ".join(prompt_parts)
        logger.info(f"Processing image generation request for: {full_prompt[:50]}...")
        
        # Check cache first
        cache_result = supabase.table("generated_images") \
            .select("image_url") \
            .eq("prompt_hash", full_prompt) \
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
                # Use Stability AI's API
                url = "https://api.stability.ai/v2beta/stable-image/generate/core"
                
                headers = {
                    "Authorization": f"Bearer {stability_api_key}",
                    "Accept": "application/json"
                }
                
                # Prepare multipart form data with simplified parameters
                files = {
                    "prompt": (None, full_prompt),
                    "cfg_scale": (None, "7.0"),
                    "steps": (None, "30")
                }

                response = requests.post(url, headers=headers, files=files)
                
                
                if response.status_code != 200:
                    error_detail = response.json()
                    logger.error(f"Stability API error: {error_detail}")
                    if response.status_code == 400:
                        raise HTTPException(status_code=400, detail=f"Invalid parameters provided: {error_detail}")
                    elif response.status_code == 403:
                        raise HTTPException(status_code=403, detail=f"Content moderation triggered: {error_detail}")
                    elif response.status_code == 429:
                        raise HTTPException(status_code=429, detail=f"Rate limit exceeded: {error_detail}")
                    else:
                        raise HTTPException(status_code=response.status_code, detail=f"Stability API error: {error_detail}")
                
                # Extract image from response
                response_data = response.json()
                if not response_data.get("image"):
                    raise HTTPException(status_code=500, detail="No image in response")
                
                # Decode base64 image
                image_bytes = base64.b64decode(response_data["image"])
                
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
                    "prompt_hash": full_prompt,
                    "image_url": image_url
                }).execute()
                
                if not cache_response.data:
                    # If cache insert fails, try to clean up the uploaded file
                    supabase.storage.from_("generated-images").remove([file_path])
                    raise HTTPException(status_code=500, detail="Failed to store image metadata")
                
                return {"image_url": image_url}
                
            except HTTPException as he:
                # Re-raise HTTP exceptions without retry
                raise he
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
                
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error occurred: {str(e)}"
        )
