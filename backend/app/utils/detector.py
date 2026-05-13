from ultralytics import YOLO
import os

# Load model once when the module is imported
MODEL_PATH = "app/models/weights/best.pt"
model = YOLO(MODEL_PATH)

def get_image_rating(image_path: str):
    # Run YOLO
    results = model(image_path, conf=0.25)[0]
    
    detections = []
    for box in results.boxes:
        detections.append({
            "class": results.names[int(box.cls[0])],
            "confidence": float(box.conf[0]),
            "bbox": box.xyxy[0].tolist()  # [x1, y1, x2, y2]
        })

    # Basic Heuristic: Start at 100, deduct for missing essentials
    score = 100
    labels = [d["class"] for d in detections]
    
    if "keyboard" not in labels: score -= 30
    if "monitor" not in labels: score -= 30
    
    return {
        "score": max(0, score),
        "detections": detections,
        "summary": f"Found {len(detections)} components."
    }