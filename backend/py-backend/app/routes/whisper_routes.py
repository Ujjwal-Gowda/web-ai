from fastapi import APIRouter, UploadFile, File
import whisper
import os

router = APIRouter()
model = whisper.load_model("tiny")


@router.post("/text")
async def transcribe(file: UploadFile = File(...)):
    with open(file.filename, "wb") as f:
        f.write(await file.read())
    result = model.transcribe(file.filename)

    os.remove(file.filename)
    return {"text": result["text"], "language": result["language"]}
