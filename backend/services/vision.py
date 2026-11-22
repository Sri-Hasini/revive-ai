
import os
import base64
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from google import genai
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
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        interaction = client.interactions.create(
            model="gemini-3.8-flash",
            input=[
                {
                    "type": "text",
                    "text": prompt
                },
                {
                    "type": "image",
                    "data": image_base64,
                    "mime_type": mime_type
                }
            ],
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": ItemIdentification.model_json_schema()
            }
        )

        if not interaction.output_text:
            raise RuntimeError("Gemini returned an empty response.")

        result = ItemIdentification.model_validate_json(
            interaction.output_text
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
