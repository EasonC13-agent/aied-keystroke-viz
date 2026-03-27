# Vue 3 Adapter

Keystroke tracking for Vue 3 via a composable or a custom directive.

## Installation

```bash
npm install keystroke-tracker-sdk
```

## Composable: `useKeystrokeTracker`

```vue
<script setup>
import { useKeystrokeTracker } from 'keystroke-tracker-sdk/adapters/vue';

const { elementRef, getData } = useKeystrokeTracker({
  trackTimestamps: true,
  trackFocusBlur: true
});

function handleSubmit() {
  const data = getData();
  fetch('/api/keystroke-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
</script>

<template>
  <textarea ref="elementRef" placeholder="Type your answer..." />
  <button @click="handleSubmit">Submit</button>
</template>
```

## Directive: `v-track-keystrokes`

Register the directive globally:

```js
import { vTrackKeystrokes } from 'keystroke-tracker-sdk/adapters/vue';

const app = createApp(App);
app.directive('track-keystrokes', vTrackKeystrokes);
```

Use in any template:

```vue
<template>
  <textarea v-track-keystrokes="{ trackTimestamps: true }" ref="myInput" />
  <button @click="getTrackerData">Submit</button>
</template>

<script setup>
import { ref } from 'vue';
const myInput = ref(null);

function getTrackerData() {
  // The directive attaches the tracker instance to the element
  const data = myInput.value.__keystrokeTracker.getData();
  console.log(data);
}
</script>
```

## Output Schema

Same as core: `{ keypresses, pastes, copies, keystroke_order, text, ... }`
