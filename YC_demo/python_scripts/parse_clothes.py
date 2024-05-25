import base64   
import requests
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import json
import dotenv
import tempfile
dotenv.load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this according to your requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

resized_image_path = r"C:\Users\punee\OneDrive\Documents\GitHub\Coco\YC_demo\python_scripts\images\resized_image.jpg"

# Function to resize the image


def resize_image(image_path, max_dimension=1024):
    with Image.open(image_path) as img:
        width, height = img.size
        if width > max_dimension or height > max_dimension:
            # Calculate new dimensions while maintaining aspect ratio
            if width > height:
                new_width = max_dimension
                new_height = int(height * (max_dimension / width))
            else:
                new_height = max_dimension
                new_width = int(width * (max_dimension / height))

            img = img.resize((new_width, new_height), Image.ANTIALIAS)
            # Save the resized image (optional, depending on your needs)
            img.save(image_path)

# Function to encode the image


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Update the payload to work dynamically with the encoded image


def create_payload(base64_image):
    return {
        "model": "gpt-4-turbo-2024-04-09",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe all the clothing items, footwear and accessories the person is wearing including their attributes like colors, patterns, materials, fit and identifiers.use less grammar words. Use more descriptive words about the dress to capture all details of colors and patterns apart from just the basic features. give no other text"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "low"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300,
    }


api_key = os.getenv("OPENAI_API_KEY")
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

# FastAPI endpoint


@app.post("/dress_description/")
async def get_dress_description(file: UploadFile = File(...)):
    try:
        # Check file type
        if file.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(
                status_code=400, detail="File must be a JPEG or PNG image")

        # Save the image to a temporary file
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
            temp.write(contents)
            image_path = temp.name  # Get the path to the temporary file

        # Process the image
        resize_image(image_path)
        base64_image = encode_image(image_path)

        # Delete the temporary file
        os.remove(image_path)

        # Send request to OpenAI
        payload = create_payload(base64_image)

        response = requests.post(
            "https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        print(response.json())
        response.raise_for_status()  # Raise exception for bad HTTP responses

        description = response.json()["choices"][0]["message"]["content"]
        usage = response.json()["usage"]
        return JSONResponse({"description": description, "usage": usage})

    except HTTPException as e:
        raise e  # Re-raise the HTTPException
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503, detail="Error communicating with OpenAI API")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=7000,)
