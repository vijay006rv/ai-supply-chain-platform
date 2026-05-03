# services/location_resolver.py

"""
Resolves supplier location names (city-level) to country & region.
Works for Indian dataset now and global dataset later.
"""

INDIAN_CITIES = {
    "DELHI", "MUMBAI", "CHENNAI", "BANGALORE", "BENGALURU",
    "KOLKATA", "HYDERABAD", "PUNE", "AHMEDABAD", "JAIPUR",
    "LUCKNOW", "SURAT", "KANPUR", "NAGPUR", "INDORE",
    "BHOPAL", "PATNA", "VISAKHAPATNAM", "VADODARA"
}


def resolve_country(location: str) -> str:
    """
    Convert supplier location to country.
    """
    if not location:
        return "GLOBAL"

    loc = location.strip().upper()

    # Indian dataset mapping
    if loc in INDIAN_CITIES:
        return "INDIA"

    # Already country name
    if len(loc) > 3:
        return loc

    return "GLOBAL"


def country_to_region(country: str) -> str:
    """
    Map country → ESG region.
    """
    country = country.upper()

    asia = {
        "INDIA", "CHINA", "JAPAN", "SOUTH KOREA",
        "INDONESIA", "THAILAND", "VIETNAM", "BANGLADESH"
    }

    europe = {
        "GERMANY", "FRANCE", "ITALY", "SPAIN", "UNITED KINGDOM",
        "POLAND", "SWEDEN", "NORWAY"
    }

    americas = {
        "UNITED STATES", "UNITED STATES OF AMERICA", "CANADA",
        "BRAZIL", "ARGENTINA", "MEXICO"
    }

    if country in asia:
        return "Asia"
    if country in europe:
        return "Europe"
    if country in americas:
        return "North America"

    return "Global"