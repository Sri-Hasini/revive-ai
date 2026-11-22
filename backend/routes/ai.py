
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.vision import identify_item

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Image Identification"]
)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
}


def validate_image(image_bytes: bytes, content_type: str):
    """Check image type and basic file signature."""

    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    if content_type == "image/jpeg":
        valid = image_bytes.startswith(b"\xff\xd8\xff")
    elif content_type == "image/png":
        valid = image_bytes.startswith(b"\x89PNG\r\n\x1a\n")
    else:
        valid = (
            len(image_bytes) >= 12
            and image_bytes[:4] == b"RIFF"
            and image_bytes[8:12] == b"WEBP"
        )

    if not valid:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image of the declared type."
        )


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Upload an image and identify its main object using Gemini.
    """

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format. Upload JPG, JPEG, PNG or WEBP."
        )

    image_bytes = await file.read(MAX_FILE_SIZE + 1)

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty."
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 5 MB."
        )

    validate_image(image_bytes, file.content_type)

    try:
        result = identify_item(
            image_bytes=image_bytes,
            mime_type=file.content_type
        )

        return result

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        ) from error

    finally:
        await file.close()
