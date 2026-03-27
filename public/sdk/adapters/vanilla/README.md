# Vanilla JS Adapter

Use the KeystrokeTracker core directly with plain JavaScript. No frameworks needed.

## Usage

### Via CDN

```html
<script src="dist/keystroke-core.min.js"></script>
<script>
  var tracker = new KeystrokeTracker({
    trackTimestamps: true,
    trackFocusBlur: true
  });

  var textarea = document.querySelector('#my-textarea');
  tracker.attach(textarea);

  // On form submit
  document.querySelector('form').addEventListener('submit', function() {
    var data = tracker.getData();
    // Send data to your server
    fetch('/api/keystroke-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  });
</script>
```

### Via npm

```javascript
const KeystrokeTracker = require('keystroke-tracker-sdk');

const tracker = new KeystrokeTracker({ trackTimestamps: true });
tracker.attach(document.querySelector('textarea'));

// Later...
const data = tracker.getData();
tracker.detach();
```

## Demo

Open `index.html` in a browser to see a live demo.

## API

| Method | Description |
|--------|-------------|
| `new KeystrokeTracker(options)` | Create a tracker instance |
| `tracker.attach(element)` | Start tracking on a textarea/input |
| `tracker.detach()` | Stop tracking and remove listeners |
| `tracker.getData()` | Get tracking data as an object |
| `tracker.toJSON()` | Get tracking data as a JSON string |
| `tracker.reset()` | Reset all counters |
