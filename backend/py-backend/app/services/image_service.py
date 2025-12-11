from rembg import remove, new_session
from PIL import Image
import io
import os
from pathlib import Path

session = new_session(model_name="u2netp")


def remove_background(file):
    try:
        contents = file.file.read()
        input_image = Image.open(io.BytesIO(contents))
        output_image = remove(input_image, session=session)

        output_dir = Path("processed")
        output_dir.mkdir(exist_ok=True)

        filename = file.filename or "output.png"
        output_path = output_dir / filename

        output_image.save(output_path, format="PNG")

        return str(output_path)

    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")
    finally:
        file.file.close()
