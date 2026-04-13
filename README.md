# 🚀 Battlestation Rater: Custom Object Detection & Spatial Heuristics

**Battlestation Rater** is an end-to-end computer vision application designed to analyze complex indoor environments. By leveraging a custom-trained **YOLOv8** model and deterministic spatial heuristics, this app detects PC setup components (keyboards, mice, monitors, RGB) and calculates an aggregate aesthetic score based on spatial composition and cable management.

---

## 🏗️ Tech Stack

### Backend
* **FastAPI:** High-performance Python framework for the API.
* **YOLOv8 (Ultralytics):** Real-time object detection architecture.
* **OpenCV:** Used for contour detection and cable density mapping.
* **Pydantic Settings:** For secure environment variable management.

### Frontend
* **React.js:** Modern UI for image uploads and real-time result rendering.
* **Tailwind CSS:** For a sleek, gamer-centric dashboard aesthetic.

### Data Pipeline
* **Roboflow:** Bounding-box annotation, augmentation, and dataset hosting.
* **Reddit Scrapers:** Custom data collection from `r/battlestations` and `r/shittybattlestations`.

---

## 📁 Project Structure

```text
battlestation/
├── backend/           # FastAPI Application
│   ├── app/           # Logic, Routes, and AI Models
│   ├── venv/          # Local Environment (Ignored by Git)
│   ├── .gitignore     # Git exclusion rules
│   ├── .env.example   # Template for secrets
│   └── requirements.txt
├── frontend/          # React Application
└── README.md          # Project Documentation
```
## ⚙️ Setup Instructions

### 1. Backend Setup (WSL/Ubuntu)
1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure Environment Variables:**
    ```bash
    cp .env.example .env
    # Edit .env with your specific settings
    ```
5.  **Run the development server:**
    ```bash
    fastapi dev app/main.py
    ```

### 2. Frontend Setup
1.  **Navigate to the frontend folder:**
    ```bash
    cd frontend
    ```
2.  **Install packages:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```

---

## 🧠 Core Objectives & Deliverables
* **End-to-End CV Lifecycle:** Managed data from raw scraping to manual annotation (Roboflow) to deployment.
* **Spatial Heuristics:** Custom Python algorithms evaluating **Intersection over Union (IoU)** and bounding box aspect ratios to determine desk symmetry.
* **Performance Metrics:** Technical reporting on **Mean Average Precision (mAP@50)** for custom-trained classes.
* **Wire Clutter Analysis (Bonus):** Utilizes OpenCV edge mapping to dynamically deduct points based on the pixel density of exposed wires.

---

## 📊 Visuals & Results
The web application draws bounding boxes and confidence scores over user-uploaded images, providing a detailed breakdown of the "Aesthetic Score."

---

## 📬 Contact
📧 [Azfarul Iman]  
🔗 [Linkedin]()

📧 [Hakimi Mahadzir]  
🔗 [Linkedin](https://www.linkedin.com/in/hakimi-mahadzir-a16039295/)

📧 [Hazim Borkhan]  
🔗 [Linkedin]()

📧 [Abdul Hafiz]  
🔗 [Linkedin]()

📧 [Tengku Haikal]  
🔗 [Linkedin]()
