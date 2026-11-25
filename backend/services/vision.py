
import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from pydantic import BaseModel, Field, ValidationError


# Load the .env file from the project root
PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")


# Expected image identification response
class ItemIdentification(BaseModel):
    item_name: str
    category: Literal[
        "Electronics",
        "Furniture",
        "Plastic",
        "Paper",
        "Metal",
        "Clothing",
        "Glass",
        "Other"
    ]
    materials: list[str]
    confidence: float = Field(ge=0.0, le=1.0)
    description: str


def identify_item(image_bytes: bytes, mime_type: str) -> dict:

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError("Gemini API key not found. Check .env.")

    try:
        from google import genai
        from google.genai import types
    except ImportError as err:
        raise RuntimeError("google-genai is not installed. Run: pip install -r backend/requirements.txt") from err

    client = genai.Client(api_key=api_key)

    prompt = """
    Analyze the uploaded image and identify its main visible object.

    Return:
    1. item_name: Common name of the object.
    2. category: Choose exactly one:
       Electronics, Furniture, Plastic, Paper, Metal,
       Clothing, Glass, or Other.
    3. materials: List identifiable or likely materials.
    4. confidence: Estimated confidence from 0.0 to 1.0.
       This is an AI estimate, not a calibrated probability.
    5. description: A short description.

    Do not invent details that cannot be determined.

    If no recognizable object is visible, use:
    item_name = "Unclear"
    category = "Other"
    materials = []
    confidence = 0.0
    description = "No clearly identifiable object was found."
    """

    try:
        # Official Google GenAI generate_content SDK format; model configurable via .env.
        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            contents=[
                types.Part.from_text(text=prompt),
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ItemIdentification,
            ),
        )

        if not response.text:
            raise RuntimeError("Gemini returned an empty response.")

        result = ItemIdentification.model_validate_json(
            response.text
        )

        return result.model_dump()

    except ValidationError as error:
        raise RuntimeError(
            "Gemini returned an invalid identification response."
        ) from error

    except RuntimeError:
        raise

    except Exception as error:
        raise RuntimeError(
            f"Gemini image analysis failed: {error}"
        ) from error
