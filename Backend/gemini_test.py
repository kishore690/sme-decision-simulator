print("Program started")

from google import genai
from dotenv import load_dotenv
import os

print("Imports successful")

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print("API Key Loaded:", api_key is not None)

client = genai.Client(api_key=api_key)

print("Calling Gemini...")

response = client.models.generate_content(
    model="gemini-flash-latest",
    contents="Say hello in one sentence."
)

print("Response received")
print(response)
print("Text:", repr(response.text))