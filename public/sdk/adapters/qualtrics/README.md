# Qualtrics Adapter

Integrate keystroke tracking into Qualtrics surveys. This adapter wraps the core `KeystrokeTracker` library and stores data in Qualtrics Embedded Data fields.

**This is 100% backwards compatible with v1.0.** If you already use the SDK, nothing changes.

## Setup

### 1. Survey Flow

In Qualtrics, go to **Survey Flow** and add an **Embedded Data** element at the very top:
- Field name: `keystroke_log`
- Leave the value blank

### 2. Header Script

Go to **Look & Feel > General > Header > Edit > Source** and paste:

```html
<script src="dist/keystroke-tracker.min.js"></script>
```

Or copy the contents of `header.js` into a `<script>` tag (after including the core).

### 3. Per-Question JavaScript

For each open-ended question, click the question > **Add JavaScript** > paste:

```javascript
Qualtrics.SurveyEngine.addOnload(function() {
  trackQuestion(this);
});
```

### Options

```javascript
trackQuestion(this, {
  trackFocusBlur: true,     // Track tab switches
  trackTimestamps: true,    // Add ms timestamps
  fieldName: 'keystroke_log' // Custom field name
});
```

## Output Schema

Each question produces a JSON record:

```json
{
  "qid": "QID1",
  "keypresses": 42,
  "pastes": 1,
  "copies": 0,
  "keystroke_order": ["H", "e", "l", "l", "o", "paste"],
  "text": "Hello world"
}
```

All records are accumulated in the `keystroke_log` embedded data field as `{ "data": [...] }`.

## Video Tutorial

📺 [YouTube: How to set up keystroke tracking in Qualtrics](https://www.youtube.com/watch?v=AosGYlN1b1Q)
