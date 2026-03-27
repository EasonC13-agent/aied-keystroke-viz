# React Adapter

Keystroke tracking for React applications via a hook and a pre-built component.

## Installation

```bash
npm install keystroke-tracker-sdk
```

## Hook: `useKeystrokeTracker`

```jsx
import { useKeystrokeTracker } from 'keystroke-tracker-sdk/adapters/react';

function SurveyQuestion() {
  const { ref, getData, reset } = useKeystrokeTracker({
    trackTimestamps: true,
    trackFocusBlur: true
  });

  const handleSubmit = () => {
    const data = getData();
    // data = { keypresses, pastes, copies, keystroke_order, text, duration_ms, ... }
    fetch('/api/keystroke-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  return (
    <div>
      <textarea ref={ref} placeholder="Type your answer..." />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## Component: `KeystrokeTrackedTextarea`

For quick integration without managing refs:

```jsx
import { KeystrokeTrackedTextarea } from 'keystroke-tracker-sdk/adapters/react';

function QuickForm() {
  return (
    <KeystrokeTrackedTextarea
      trackTimestamps
      trackFocusBlur
      onSubmitData={(data) => {
        console.log('Keystroke data:', data);
      }}
      placeholder="Type here..."
      rows={5}
    />
  );
}
```

The `onSubmitData` callback fires on blur with the current tracking data.

## Output Schema

```json
{
  "keypresses": 42,
  "pastes": 1,
  "copies": 0,
  "keystroke_order": ["H", "e", "l", "l", "o", "paste"],
  "text": "Hello world",
  "duration_ms": 5230
}
```
