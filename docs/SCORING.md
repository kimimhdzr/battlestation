# Battlestation Scoring System

This document explains how the automatic scoring in `backend/app/utils/detector.py` works.

**Overview**
- The detector first runs an object detection pass and collects detections (class name, confidence, bbox).
- If no core battlestation components are detected (monitor, laptop, or pc) the function returns a minimal report with a default low score and a short summary.

**Category Scores**
Scoring is computed across four categories: functionality, aesthetics, comfort, and entertainment. Each category is computed by a dedicated function that accumulates points from detected object counts and then passes the accumulated raw score through an exponential normalization:

Normalization formula used by `normalize_score(raw_score)`:
$$
\text{normalized} = 100 \times \left(1 - e^{-\frac{\text{raw\_score}}{20}}\right)
$$

This maps raw incremental scores into a bounded 0–100 range with diminishing returns.

Category specifics (as implemented):
- Functionality (`calculate_functionality`):
  - monitor: 1 → +15, 2 → +25, 3+ → +35
  - `pc` → +20
  - `laptop` → +15
  - keyboard+mouse pair → +15
  - `mic` → +10
  - `speaker` → +8
- Aesthetics (`calculate_aesthetics`): starts at +10 base, plus:
  - dual+ monitors → +15
  - monitor + keyboard → +10
  - speaker → +8
  - headphone → +8
  - chair → +8
- Comfort (`calculate_comfort`): starts at +10 base, plus:
  - chair → +25
  - monitor + chair → +10
  - laptop + keyboard → +8
  - headphone → +8
- Entertainment (`calculate_entertainment`): starts at +5 base, plus:
  - controller → +20
  - headphone → +15
  - speaker → +10
  - pc → +10
  - dual+ monitors → +5

After each category's raw score is summed, it is normalized with `normalize_score` to produce a 0–100 category value.

**Weighted Final Score**
- The four category scores are combined with weights:
  - functionality: 35%
  - aesthetics: 30%
  - comfort: 20%
  - entertainment: 15%

So the weighted component score is:
$$
\text{weighted} = 0.35 \times F + 0.30 \times A + 0.20 \times C + 0.15 \times E
$$

**Detection Count Bonus**
- A small bonus is added based on the total number of detected objects (to reward richer scenes):
  - `detection_bonus = min(len(detections) * 1.5, 8)`
- This bonus is added to the weighted component score.

**Scene Bonuses**
Extra one-time bonuses are applied for specific useful/complete scenes (these are additive):
- desk + (monitor or laptop) → +5
- monitor + keyboard + mouse → +5
- monitor count >= 2 → +5
- pc + controller → +5
- pc + mic + monitor count >= 2 → +8

**Minimal-setup Protection**
- If the total number of detected objects is small (<= 2), the computed final score is reduced by multiplying by 0.8 to avoid overrating very sparse detections.

**Clamping & Rounding**
- After all bonuses and adjustments, the score is clamped and rounded to an integer in the 0–100 range.

**Setup Type & Feedback**
- The `detect_setup_type` function checks patterns in the counts to classify the setup (e.g. "Streamer Setup", "Gaming Setup", "Productivity Setup", "Minimal Setup", or "General Setup").
- `generate_feedback` compiles strengths and weaknesses from category thresholds and presence/absence of key items (e.g. missing chair or keyboard).

**AI Confidence**
- The report contains an `ai_confidence` label derived from the average detection confidence:
  - average >= 0.75 → `High`
  - average >= 0.50 → `Medium`
  - otherwise → `Low`

**Edge Cases**
- If no core components are detected (no monitor, laptop, or pc), the function returns a small summary and a default low score with category scores set to 0.

**Where to inspect code**
See the implementation in `backend/app/utils/detector.py` for the exact thresholds and logic: [backend/app/utils/detector.py](backend/app/utils/detector.py#L1)

**Quick example (illustrative)**
- Detected: 2 monitors, 1 keyboard, 1 mouse, 1 pc, 1 mic (total 6 detections).
  - Raw functionality points ≈ 25 (2 monitors) + 20 (pc) + 15 (keyboard+mouse) + 10 (mic) = 70 → normalized → ~88
  - Aesthetics raw ≈ 10 base + 15 (dual monitors) + 10 (monitor+keyboard) = 35 → normalized → ~81
  - Comfort raw ≈ 10 base + 25 (chair not detected → 0) + 0 = 10 → normalized → ~39
  - Entertainment raw ≈ 5 base + 10 (pc) + 5 (dual monitors) = 20 → normalized → ~64
  - Weighted ≈ 0.35*88 + 0.30*81 + 0.20*39 + 0.15*64 ≈ 72
  - Detection bonus = min(6*1.5, 8) = 8 → +8
  - Scene bonuses (monitor+keyboard+mouse) +5, pc+mic+monitor_count>=2 +8 → +13
  - Final ≈ 72 + 8 + 13 = 93 (then clamped/rounded→93)

---
This document is a concise reference to the scoring rules implemented in `backend/app/utils/detector.py` and should help interpret generated reports and adjust weights or thresholds if you want to change evaluation behaviour.
