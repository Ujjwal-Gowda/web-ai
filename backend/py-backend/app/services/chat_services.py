from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
load_dotenv()

open_api_key=os.environ["OPEN_AI_KEY"] 
model = init_chat_model("gpt-4.1", api_key=open_api_key)
def generate_response_from_model(message: str) -> str:
    response = model.invoke(message)
    return str(response) 
