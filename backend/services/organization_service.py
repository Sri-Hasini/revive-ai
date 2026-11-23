
import requests

# Multiple Overpass servers for better availability
OVERPASS_URLS = [
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass-api.de/api/interpreter"
]

CATEGORY_TAGS = {
    "recycle": [
        '["amenity"="recycling"]'
    ],
    "e_waste": [
        '["amenity"="recycling"]["recycling:electrical_appliances"="yes"]',
        '["amenity"="recycling"]["recycling:small_appliances"="yes"]',
        '["amenity"="recycling"]["recycling:computers"="yes"]'
    ],
    "donate": [
        '["amenity"="charity"]',
        '["shop"="charity"]'
    ],
    "repair": [
        '["shop"="repair"]',
        '["craft"="electronics_repair"]'
    ]
}


def find_nearby_organizations(
    lat,
    lon,
    organization_type,
    radius=5000
):
    # Validate inputs
    if not -90 <= lat <= 90:
        raise ValueError("Invalid latitude")

    if not -180 <= lon <= 180:
        raise ValueError("Invalid longitude")

    if organization_type not in CATEGORY_TAGS:
        raise ValueError("Invalid organization type")

    if not 100 <= radius <= 50000:
        raise ValueError("Radius must be between 100 and 50000 metres")

    # Build Overpass query
    query_parts = []

    for tag in CATEGORY_TAGS[organization_type]:
        query_parts.append(
            f"node{tag}(around:{radius},{lat},{lon});"
            f"way{tag}(around:{radius},{lat},{lon});"
            f"relation{tag}(around:{radius},{lat},{lon});"
        )

    overpass_query = f"""
    [out:json][timeout:25];
    (
        {"".join(query_parts)}
    );
    out center tags;
    """

    headers = {
        "User-Agent": "ReViveAI/1.0 (Organization Locator)",
        "Accept": "application/json"
    }

    data = None
    last_error = None

    # Try each server if the previous one fails
    for server_url in OVERPASS_URLS:
        try:
            print(f"Connecting to: {server_url}")

            response = requests.post(
                server_url,
                data={"data": overpass_query},
                headers=headers,
                timeout=45
            )

            response.raise_for_status()
            data = response.json()

            print("OpenStreetMap connection successful!")
            break

        except (requests.RequestException, ValueError) as error:
            last_error = error
            print(f"Server unavailable: {server_url}")

    if data is None:
        raise RuntimeError(
            f"All OpenStreetMap servers failed. Last error: {last_error}"
        )

    organizations = []
    seen = set()

    # Process organization data
    for element in data.get("elements", []):

        element_id = (
            element.get("type"),
            element.get("id")
        )

        if element_id in seen:
            continue

        seen.add(element_id)

        tags = element.get("tags", {})

        coordinates = element.get("center") or element

        latitude = coordinates.get("lat")
        longitude = coordinates.get("lon")

        if latitude is None or longitude is None:
            continue

        address_parts = [
            tags.get("addr:housenumber"),
            tags.get("addr:street"),
            tags.get("addr:suburb"),
            tags.get("addr:city")
        ]

        address = ", ".join(
            part for part in address_parts if part
        )

        organization = {
            "name": tags.get("name", "Unnamed organization"),
            "type": organization_type,
            "latitude": latitude,
            "longitude": longitude,
            "address": address or "Address not available"
        }

        organizations.append(organization)

    return organizations
