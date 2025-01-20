import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

# Set project ID and location
PROJECT_ID = "noodle-spark"
LOCATION = "us-central1"

# Initialize Vertex AI
vertexai.init(project=PROJECT_ID, location=LOCATION)

try:
    # Create the model
    model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
    prompt = "A cute robot chef cooking in a futuristic kitchen"
    print(f"Generating image for prompt: {prompt}")
    
    # Generate images
    images = model.generate_images(
        prompt=prompt,
        number_of_images=1,
        language="en",
        aspect_ratio="1:1",
        safety_filter_level="block_some"
    )
    
    # Save the generated images
    for idx, image in enumerate(images):
        output_file = f"generated_image_{idx}.png"
        image.save(location=output_file, include_generation_parameters=False)
        print(f"Image saved as: {output_file}")

except Exception as e:
    print(f"Error occurred: {str(e)}")
