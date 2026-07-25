import io
import os

from PIL import Image, ImageOps
from django.core.files.uploadedfile import InMemoryUploadedFile

MAX_DIMENSION = 1920
JPEG_QUALITY = 82
PNG_COMPRESS_LEVEL = 7


def optimize_image(uploaded_file):

    position = uploaded_file.tell()

    uploaded_file.seek(0)

    image = Image.open(uploaded_file)

    image = ImageOps.exif_transpose(image)

    original_format = (image.format or "JPEG").upper()

    if original_format == "JPG":
        original_format = "JPEG"

    if image.width > MAX_DIMENSION or image.height > MAX_DIMENSION:

        image.thumbnail(
            (MAX_DIMENSION, MAX_DIMENSION),
            Image.LANCZOS
        )

    buffer = io.BytesIO()

    if original_format == "PNG":

        image.save(
            buffer,
            format="PNG",
            optimize=True,
            compress_level=PNG_COMPRESS_LEVEL
        )

        content_type = "image/png"

    else:

        if image.mode in ("RGBA", "P", "LA"):
            image = image.convert("RGB")

        image.save(
            buffer,
            format="JPEG",
            quality=JPEG_QUALITY,
            optimize=True
        )

        content_type = "image/jpeg"

    buffer.seek(0)

    uploaded_file.seek(position)

    name = os.path.splitext(uploaded_file.name)[0]

    extension = ".png" if original_format == "PNG" else ".jpg"

    return InMemoryUploadedFile(
        buffer,
        field_name=None,
        name=f"{name}{extension}",
        content_type=content_type,
        size=buffer.getbuffer().nbytes,
        charset=None,
    )