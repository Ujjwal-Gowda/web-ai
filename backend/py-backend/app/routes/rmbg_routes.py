from fastapi import APIRouter, File, UploadFile
from app.services.image_service import remove_background

router = APIRouter()


@router.post("/rmbg")
async def remove_bg(file: UploadFile = File(...)):
    output_path = remove_background(file)
    return {"result": output_path}
