from ultralytics import YOLO
from collections import Counter
import math

MODEL_PATH = "app/models/weights/best.pt"
model = YOLO(MODEL_PATH)

def get_image_rating(image_path: str):
    results = model(image_path, conf=0.25)[0]

    detections = []
    for box in results.boxes:
        detections.append({
            "class": results.names[int(box.cls[0])],
            "confidence": float(box.conf[0]),
            "bbox": box.xyxy[0].tolist()
        })

    labels = [d["class"] for d in detections]
    counts = Counter(labels)

    # Core setup validation
    has_core_setup = (
        counts.get("monitor", 0) > 0
        or counts.get("laptop", 0) > 0
        or counts.get("pc", 0) > 0
    )

    if not has_core_setup:
        return {
            "score": 5,
            "setup_type": "No Battlestation Detected",
            "category_scores": {
                "functionality": 0,
                "aesthetics": 0,
                "comfort": 0,
                "entertainment": 0
            },
            "strengths": [],
            "weaknesses": ["No clear battlestation detected."],
            "detections": detections,
            "summary": "AI could not detect a battlestation."
        }

    # Category scores
    functionality = calculate_functionality(counts)
    aesthetics = calculate_aesthetics(counts)
    comfort = calculate_comfort(counts)
    entertainment = calculate_entertainment(counts)

    # Weighted score
    final_score = (
        functionality * 0.35 +
        aesthetics * 0.30 +
        comfort * 0.20 +
        entertainment * 0.15
    )

    # Detection count bonus (smaller)
    detection_bonus = min(len(detections) * 1.5, 8)
    final_score += detection_bonus

    # Scene bonuses (reduced)
    if counts.get("desk", 0) and (counts.get("monitor", 0) or counts.get("laptop", 0)):
        final_score += 5
    if counts.get("monitor", 0) and counts.get("keyboard", 0) and counts.get("mouse", 0):
        final_score += 5
    if counts.get("monitor", 0) >= 2:
        final_score += 5
    if counts.get("pc", 0) and counts.get("controller", 0):
        final_score += 5
    if counts.get("pc", 0) and counts.get("mic", 0) and counts.get("monitor", 0) >= 2:
        final_score += 8

    # Minimal setup protection
    total_objects = sum(counts.values())
    if total_objects <= 2:
        final_score *= 0.8

    # Clamp
    final_score = max(0, min(round(final_score), 100))

    setup_type = detect_setup_type(counts)
    strengths, weaknesses = generate_feedback(
        counts, functionality, aesthetics, comfort, entertainment
    )

    avg_confidence = calculate_average_confidence(detections)
    if avg_confidence >= 0.75:
        ai_confidence = "High"
    elif avg_confidence >= 0.50:
        ai_confidence = "Medium"
    else:
        ai_confidence = "Low"

    return {
        "score": final_score,
        "setup_type": setup_type,
        "ai_confidence": ai_confidence,
        "category_scores": {
            "functionality": round(functionality),
            "aesthetics": round(aesthetics),
            "comfort": round(comfort),
            "entertainment": round(entertainment)
        },
        "strengths": strengths,
        "weaknesses": weaknesses,
        "detections": detections,
        "summary": f"Detected {len(detections)} components."
    }

# --- Category scoring with lower baselines ---

def calculate_functionality(counts):
    score = 0
    monitor_count = counts.get("monitor", 0)
    if monitor_count == 1: score += 15
    elif monitor_count == 2: score += 25
    elif monitor_count >= 3: score += 35
    if counts.get("pc", 0): score += 20
    if counts.get("laptop", 0): score += 15
    if counts.get("keyboard", 0) and counts.get("mouse", 0): score += 15
    if counts.get("mic", 0): score += 10
    if counts.get("speaker", 0): score += 8
    return normalize_score(score)

def calculate_aesthetics(counts):
    score = 10
    if counts.get("monitor", 0) >= 2: score += 15
    if counts.get("monitor", 0) and counts.get("keyboard", 0): score += 10
    if counts.get("speaker", 0): score += 8
    if counts.get("headphone", 0): score += 8
    if counts.get("chair", 0): score += 8
    return normalize_score(score)

def calculate_comfort(counts):
    score = 10
    if counts.get("chair", 0): score += 25
    if counts.get("monitor", 0) and counts.get("chair", 0): score += 10
    if counts.get("laptop", 0) and counts.get("keyboard", 0): score += 8
    if counts.get("headphone", 0): score += 8
    return normalize_score(score)

def calculate_entertainment(counts):
    score = 5
    if counts.get("controller", 0): score += 20
    if counts.get("headphone", 0): score += 15
    if counts.get("speaker", 0): score += 10
    if counts.get("pc", 0): score += 10
    if counts.get("monitor", 0) >= 2: score += 5
    return normalize_score(score)

def normalize_score(raw_score):
    normalized = 100 * (1 - math.exp(-raw_score / 20))
    return min(normalized, 100)

def detect_setup_type(counts):
    if counts.get("pc", 0) and counts.get("mic", 0) and counts.get("monitor", 0) >= 2:
        return "Streamer Setup"
    if counts.get("pc", 0) and counts.get("controller", 0):
        return "Gaming Setup"
    if counts.get("laptop", 0) and counts.get("monitor", 0) and counts.get("keyboard", 0):
        return "Productivity Setup"
    if counts.get("laptop", 0) and sum(counts.values()) <= 3:
        return "Minimal Setup"
    return "General Setup"

def calculate_average_confidence(detections):
    if len(detections) == 0: return 0
    return sum(d["confidence"] for d in detections) / len(detections)

def generate_feedback(counts, functionality, aesthetics, comfort, entertainment):
    strengths, weaknesses = [], []
    if functionality >= 65: strengths.append("Strong productivity and workstation capability.")
    if entertainment >= 65: strengths.append("Good entertainment and gaming potential.")
    if comfort >= 60: strengths.append("Comfort-oriented setup detected.")
    if aesthetics >= 65: strengths.append("Visually pleasing battlestation layout.")
    if counts.get("monitor", 0) >= 2: strengths.append("Dual monitor setup improves multitasking.")
    if counts.get("mic", 0): strengths.append("Dedicated microphone enhances creator capability.")
    if not counts.get("chair", 0): weaknesses.append("No ergonomic chair detected.")
    if not counts.get("headphone", 0): weaknesses.append("Limited immersive audio equipment.")
    if not counts.get("keyboard", 0): weaknesses.append("Keyboard not clearly detected.")
    if counts.get("monitor", 0) == 0: weaknesses.append("No dedicated monitor detected.")
    return strengths, weaknesses
