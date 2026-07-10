from rest_framework.exceptions import ValidationError
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


def validate_image(file):

    ext = os.path.splitext(file.name)[1].lower()

    if ext not in IMAGE_EXTENSIONS:
        raise ValidationError("فرمت تصویر مجاز نیست.")




def validate_video(file):

    ext = os.path.splitext(file.name)[1].lower()

    if ext not in VIDEO_EXTENSIONS:
        raise ValidationError("فرمت ویدیو مجاز نیست.")
