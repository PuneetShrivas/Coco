from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import dotenv
dotenv.load_dotenv()
from pydantic import BaseModel
from openai import OpenAI
import re
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this according to your requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = OpenAI(
    api_key=""
)

import pandas as pd

from elasticsearch import Elasticsearch
import pandas as pd

# Define Elasticsearch host and credentials
password = 'ZoKdYJsOhbAWAFTQVnSV4xBe'

# Connect to Elasticsearch cluster
es = Elasticsearch("http://localhost:9200")

# Function to search for clothing items in Elasticsearch
def search_clothing(es, search_terms, colors):
    # Elasticsearch query to search for clothing items
    query = {
        "query": {
            "bool": {
                "should": [
                    {
                        "multi_match": {
                            "query": " ".join(search_terms),
                            "fields": ["description", "name", "p_attributes"]
                        }
                    },
                    {
                        "multi_match": {
                            "query": " ".join(colors),
                            "fields": ["description", "colour"]
                        }
                    }
                ]
            }
        },
        "sort": [
            {"_score": {"order": "desc"}},
            {"ratingCount": {"order": "desc"}},
            {"avg_rating": {"order": "desc"}}
        ],
        "size": 5,
        "_source": ["name", "img"]
    }

    # Perform Elasticsearch search
    result = es.search(index="fashion_index", body=query)
    
    # Extract product names and image links
    top_product_names = [hit['_source']['name'] for hit in result['hits']['hits']]
    top_product_img = [hit['_source']['img'] for hit in result['hits']['hits']]
    
    return top_product_names, top_product_img

# Example search terms and colors
# search_terms = ['floral', 'kurta']
# colors = ['green']

# # Search for clothing items
# top_product_names, top_product_img = search_clothing(es, search_terms, colors)

# # Print top 5 product names and image links
# print("Top 5 Product Names:")
# print(top_product_names)
# print("\nTop 5 Product Image Links:")
# print(top_product_img)






# Define request body model
class ChatRequest(BaseModel):
    query: str

# Define response body model
class ChatResponse(BaseModel):
    response: str

def extract_terms_and_colors(response_text):
    # Regular expressions to match terms and colors
    pattern_terms = r"terms_upper\s*:\s*(.*?)\s*colors_upper\s*:\s*(.*?)\s*terms_lower\s*:\s*(.*?)\s*colors_lower\s*:\s*(.*?)\s*"
    match = re.search(pattern_terms, response_text, re.DOTALL)
    if match:
        terms_upper = [term.strip() for term in match.group(1).split(",")]
        colors_upper = [color.strip() for color in match.group(2).split(",")]
        terms_lower = [term.strip() for term in match.group(3).split(",")]
        colors_lower = [color.strip() for color in match.group(4).split(",")]
        return terms_upper, colors_upper, terms_lower, colors_lower
    else:
        return [], [], [], []

# Endpoint to handle user queries and return responses
@app.post("/ask", )
async def ask_question(request: ChatRequest):
    try:
        # Make request to OpenAI API
        chat_completion = client.chat.completions.create(
            messages=[{
                "role":"system",
                "content":"""You are a stylist in India in 2024. For the given user's query help in finding a good combination of an upperwear apparel and a bottom wear by giving search terms and colors for each. Give the output in this format: 
                1. terms_upper : floral, formal, flowing
                2. colors_upper : red, magenta
                3. terms_lower : jeans, levis
                4. colors_lower : blue, black
                """
                },  
                {
                "role": "user",
                 "content": str(request.query)}
            ],
            model="gpt-3.5-turbo"
        )
        # Extract search terms and colors from OpenAI response
        response_text = chat_completion.choices[0].message.content
        print(response_text)
        terms_upper, colors_upper, terms_lower, colors_lower = extract_terms_and_colors(response_text)

        # Search for upperwear and lowerwear based on extracted terms and colors
        name_upper, img_upper = search_clothing(es, terms_upper, colors_upper)
        name_lower, img_lower = search_clothing(es, terms_lower, colors_lower)

        return {"response":{
            "name_upper": name_upper,
            "img_upper": img_upper,
            "name_lower": name_lower,
            "img_lower": img_lower}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=7000)