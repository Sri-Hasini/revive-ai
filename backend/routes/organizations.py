
from fastapi import APIRouter, HTTPException, Query

from backend.services.organization_service import (
    find_nearby_organizations
)

router = APIRouter()


@router.get("/organizations/nearby")
def get_nearby_organizations(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    type: str = Query(..., alias="type"),
    radius: int = Query(5000, ge=100, le=50000)
):
    allowed_types = [
        "recycle",
        "e_waste",
        "donate",
        "repair"
    ]

    if type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid organization type.",
                "allowed_types": allowed_types
            }
        )

    try:
        organizations = find_nearby_organizations(
            lat=lat,
            lon=lon,
            organization_type=type,
            radius=radius
        )

        if not organizations:
            return {
                "message": (
                    "No organizations found nearby. "
                    "Try increasing the search radius "
                    "or searching in another location manually."
                ),
                "count": 0,
                "organizations": []
            }

        return {
            "message": "Nearby organizations retrieved successfully",
            "count": len(organizations),
            "organizations": organizations
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        )
