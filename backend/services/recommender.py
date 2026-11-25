
def recommend_action(item_name, category, condition, working, age_years, repairable):
    """
    Recommend the best action and calculate a reuse score.
    """

    condition = condition.lower()

    # Validate inputs
    if condition not in ["excellent", "good", "fair", "poor"]:
        raise ValueError("Condition must be excellent, good, fair, or poor.")

    if age_years < 0:
        raise ValueError("Age cannot be negative.")

    # Calculate score
    condition_scores = {
        "excellent": 30,
        "good": 25,
        "fair": 15,
        "poor": 5
    }

    score = condition_scores[condition]

    if working:
        score += 30

    if repairable:
        score += 15

    if age_years <= 2:
        score += 15
    elif age_years <= 5:
        score += 10
    elif age_years <= 8:
        score += 5

    score += 10  # Potential for another use

    score = min(score, 100)

    # Decide recommended action
    if working and condition in ["excellent", "good"]:
        action = "DONATE"
        reason = f"The {item_name} is functional and suitable for donation."

    elif not working and repairable:
        action = "REPAIR"
        reason = f"The {item_name} may be restored through repair."

    elif not working and not repairable:
        action = "RECYCLE"
        reason = f"The {item_name} is not repairable and should be recycled safely."

    else:
        action = "REUSE"
        reason = f"The {item_name} may be reused for another purpose."

    alternatives = {
        "DONATE": ["REUSE", "REPAIR"],
        "REPAIR": ["REUSE", "RECYCLE"],
        "REUSE": ["DONATE", "RECYCLE"],
        "RECYCLE": ["SAFE DISPOSAL"]
    }

    return {
        "recommended_action": action,
        "reuse_score": score,
        "reason": reason,
        "alternatives": alternatives[action]
    }


if __name__ == "__main__":

    test_items = [
        ("Laptop", "Electronics", "good", True, 5, True),
        ("Chair", "Furniture", "fair", True, 3, True),
        ("Broken Fan", "Electronics", "poor", False, 8, False)
    ]

    for item in test_items:
        result = recommend_action(*item)
        print(result)
        print("-" * 50)
