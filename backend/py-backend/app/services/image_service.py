from rembg import remove
from PIL import Image


def remove_background(file):
    input = Image.open(file.file)
    output = remove(input)
    output_path = f"processed/{file.filename}"
    output.save(output_path)
    return output_path
