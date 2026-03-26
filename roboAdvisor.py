def calculate_score(user):
    score = 0

    score += user["risk_tolerance"] * 20
    score += user["reaksi_rugi"] * 15
    score += user["pengalaman"] * 10

    if user["jangka_waktu"] == "panjang":
        score += 20
    elif user["jangka_waktu"] == "menengah":
        score += 10
    else:
        score += 5

    if user["tujuan"] == "growth":
        score += 15
    else:
        score += 5

    return score


def get_profile(score):
    if score <= 40:
        return "Conservative"
    elif score <= 70:
        return "Moderate"
    else:
        return "Aggressive"


def generate_portfolio(profile, modal):
    if profile == "Conservative":
        alokasi = [
            {"saham": "BBCA", "persen": 40},
            {"saham": "BBRI", "persen": 30},
            {"saham": "TLKM", "persen": 30}
        ]

    elif profile == "Moderate":
        alokasi = [
            {"saham": "BBCA", "persen": 30},
            {"saham": "AMRT", "persen": 30},
            {"saham": "BRIS", "persen": 40}
        ]

    else:
        alokasi = [
            {"saham": "MDKA", "persen": 40},
            {"saham": "BRIS", "persen": 30},
            {"saham": "ARTO", "persen": 30}
        ]

    # hitung nominal
    for item in alokasi:
        item["nominal"] = int((item["persen"] / 100) * modal)

    return {
        "profile": profile,
        "alokasi": alokasi
    }


def robo_advisor_logic(user):
    score = calculate_score(user)
    profile = get_profile(score)
    portfolio = generate_portfolio(profile, user["modal"])

    return {
        "score": score,
        "profile": profile,
        "rekomendasi": portfolio
    }