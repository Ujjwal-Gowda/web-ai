from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from app.services.image_service import remove_background
import os

router = APIRouter()


@router.get("/test")
async def test_rmbg():
    return {"message": "RMBG router is working!"}


@router.post("/remove-bg")
async def remove_bg_endpoint(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        output_path = remove_background(file)

        if os.path.exists(output_path):
            return FileResponse(
                output_path, media_type="image/png", filename=f"nobg_{file.filename}"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to process image")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/remove-bg-base64")
async def remove_bg_base64(file: UploadFile = File(...)):
    import base64

    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        output_path = remove_background(file)

        # Read and encode as base64
        with open(output_path, "rb") as img_file:
            img_data = base64.b64encode(img_file.read()).decode()

        # Clean up the file
        os.remove(output_path)

        return {
            "success": True,
            "image": f"data:image/png;base64,{img_data}",
            "filename": f"nobg_{file.filename}",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
