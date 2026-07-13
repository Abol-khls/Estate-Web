from rest_framework.exceptions import ValidationError
from PIL import Image
import os


IMAGE_MAX_SIZE = 5 * 1024 * 1024
VIDEO_MAX_SIZE = 50 * 1024 * 1024


IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
]

VIDEO_EXTENSIONS = [
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
]

VIDEO_SIGNATURES = [
    b"\x00\x00\x00\x18ftyp",
    b"\x00\x00\x00\x1cftyp",
    b"\x00\x00\x00\x20ftyp",
    b"ftyp",
    b"\x1aE\xdf\xa3",
    b"RIFF",
]


def validate_image(file):

    ext = os.path.splitext(file.name)[1].lower()

    if ext not in IMAGE_EXTENSIONS:
        raise ValidationError("فرمت تصویر مجاز نیست.")

    position = file.tell()

    try:
        image = Image.open(file)
        image.verify()
    except Exception:
        raise ValidationError("فایل ارسال‌شده یک تصویر معتبر نیست.")
    finally:
        file.seek(position)


def validate_video(file):

    ext = os.path.splitext(file.name)[1].lower()

    if ext not in VIDEO_EXTENSIONS:
        raise ValidationError("فرمت ویدیو مجاز نیست.")

    position = file.tell()

    header = file.read(64)

    file.seek(position)

    if not any(signature in header for signature in VIDEO_SIGNATURES):
        raise ValidationError("فایل ارسال‌شده یک ویدیوی معتبر نیست.")