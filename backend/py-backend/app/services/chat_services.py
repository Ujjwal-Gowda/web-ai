
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
from openai import OpenAI
load_dotenv()

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ["HF_TOKEN"],
)
def generate_response_from_model(message: str) -> str:
    try:
        completion = client.chat.completions.create(
            model="moonshotai/Kimi-K2-Thinking:novita",
            messages=[
                {"role": "user", "content": message}
            ],
        )

        return completion.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"
