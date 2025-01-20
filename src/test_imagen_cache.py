import unittest
import requests
import os
import time
from supabase import create_client, Client
from dotenv import load_dotenv
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Load environment variables
load_dotenv()

def create_session_with_retries():
    session = requests.Session()
    retries = Retry(total=5, backoff_factor=0.1)
    session.mount('http://', HTTPAdapter(max_retries=retries))
    return session

class TestImageGenerationCache(unittest.TestCase):
    def setUp(self):
        """Initialize test environment"""
        self.api_url = "http://127.0.0.1:8000"
        self.test_prompt = "a beautiful sunset over mountains"
        
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        self.supabase: Client = create_client(supabase_url, supabase_key)

        # Verify Supabase connection
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file")

    def test_e2e_cache_flow(self):
        """Test end-to-end flow including cache miss and hit"""
        # Step 1: Clear existing cache for test prompt
        self.supabase.table("generated_images") \
            .delete() \
            .eq("prompt_hash", self.test_prompt) \
            .execute()
        
        # Step 2: First request (cache miss)
        print("\nTesting cache miss scenario...")
        session = create_session_with_retries()
        response1 = session.post(
            f"{self.api_url}/generate_image/",
            json={"prompt": self.test_prompt}
        )
        if response1.status_code != 200:
            print(f"\nError response: {response1.json()}")
        self.assertEqual(response1.status_code, 200)
        first_url = response1.json()["image_url"]
        print(f"First request URL: {first_url}")
        
        # Step 3: Verify storage and cache entry
        cache_result = self.supabase.table("generated_images") \
            .select("*") \
            .eq("prompt_hash", self.test_prompt) \
            .execute()
        self.assertEqual(len(cache_result.data), 1)
        print("Cache entry created successfully")
        
        # Step 4: Second request (cache hit)
        print("\nTesting cache hit scenario...")
        response2 = session.post(
            f"{self.api_url}/generate_image/",
            json={"prompt": self.test_prompt}
        )
        self.assertEqual(response2.status_code, 200)
        second_url = response2.json()["image_url"]
        print(f"Second request URL: {second_url}")
        
        # Step 5: Verify URLs match
        self.assertEqual(first_url, second_url)
        print("Cache hit verified - URLs match")
        
        # Step 6: Verify image exists in storage
        image_id = first_url.split("/")[-1].split(".")[0]
        storage_result = self.supabase.storage \
            .from_("generated-images") \
            .list()
        storage_files = [file["name"] for file in storage_result]
        self.assertIn(f"{image_id}.png", storage_files)
        print("Image file exists in storage")

    def test_error_handling(self):
        """Test error handling scenarios"""
        # Test invalid prompt
        print("\nTesting error handling...")
        session = create_session_with_retries()
        response = session.post(
            f"{self.api_url}/generate_image/",
            json={"prompt": ""}
        )
        self.assertEqual(response.status_code, 500)
        print("Error handling for invalid prompt verified")

if __name__ == "__main__":
    unittest.main(verbosity=2)
