from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
)

MODEL = "openai/gpt-oss-120b:free"


def build_system_prompt(detection_context: dict | None) -> str:
    base = (
        "You are BATTLE-BOT, an AI battlestation advisor with deep expertise in "
        "gaming peripherals, PC setups, ergonomics, and RGB aesthetics. "
        "You speak concisely and with enthusiasm. "
        "When the user has scanned their setup, reference the specific results. "
        "The detector can recognize these useful battlestation classes: chair, "
        "controller, desk, headphone, keyboard, laptop, mic, monitor, mouse, pc, "
        "phone, and speaker. "
        "Prioritize advice around the core setup items: monitor, keyboard, mouse, "
        "desk, chair, pc or laptop, headphone, mic, and speaker. "
        "Treat controller and phone as optional accessories; mention them only briefly "
        "when they are relevant, and do not make them a major part of the review. "
        "Do not judge or comment on cables or cable management from scan results. "
        "When suggesting upgrades, give concrete product category recommendations. "
        "Keep responses under 200 words unless asked for more detail. "
        "Never use markdown formatting — no bold, no italics, no bullet points, no headers. "
        "Write in plain sentences only."
    )

    if not detection_context:
        return base + "\n\nNo scan has been performed yet. Answer general battlestation questions."

    score = detection_context.get("score", "unknown")
    detections = detection_context.get("detections", [])
    detected_classes = [d["class"] for d in detections]
    missing = [c for c in ["keyboard", "monitor", "mouse"] if c not in detected_classes]

    context_block = f"""
CURRENT SCAN RESULTS:
- Score: {score}/100
- Detected components: {", ".join(detected_classes) if detected_classes else "none"}
- Missing essential components: {", ".join(missing) if missing else "none"}
- Total components found: {len(detections)}

Use these results when the user asks about their setup.
"""
    return base + "\n\n" + context_block


def stream_chat(system_prompt: str, messages_payload: list):
    stream = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": system_prompt}, *messages_payload],
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield f"data: {delta}\n\n"
    yield "data: [DONE]\n\n"
