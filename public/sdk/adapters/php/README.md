# PHP Adapter

A server-side PHP endpoint for receiving keystroke tracking data, plus a front-end HTML snippet.

## Files

- `receive.php` - Backend endpoint that validates and stores keystroke data
- `snippet.html` - Front-end example with the tracker and form submission

## Setup

1. Place `receive.php` on your PHP server
2. Include the core JS on your front-end page:

```html
<script src="dist/keystroke-core.min.js"></script>
```

3. Track and submit:

```javascript
var tracker = new KeystrokeTracker({ trackTimestamps: true });
tracker.attach(document.querySelector('textarea'));

// On form submit
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch('receive.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tracker.getData())
  });
});
```

## Storage

By default, `receive.php` appends records to `keystroke_log.jsonl` (one JSON object per line). You can switch to a database by uncommenting the PDO section in the file.

## Security Notes

For production use:
- Add authentication (API key, session token, etc.)
- Rate limit the endpoint
- Validate data size limits
- Use HTTPS
