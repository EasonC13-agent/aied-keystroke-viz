# Keystroke Log Analyzer

A browser-based visualization dashboard for analyzing keystroke tracking data and flagging potentially outsourced responses (e.g., AI-generated text pasted from external tools).

🔗 **Live Demo**: [keystroke-viz-anon.vercel.app](https://keystroke-viz-anon.vercel.app/)

📖 **SDK Documentation**: [keystroke-viz-anon.vercel.app/docs](https://keystroke-viz-anon.vercel.app/docs/) - Integration guides for Qualtrics, React, Vue, Angular, vanilla JS, and PHP

## Features

- **CSV Upload**: Drag-and-drop or click to upload keystroke data (supports Qualtrics exports and generic CSV formats)
- **Automated Flagging**: Flags responses based on two indicators:
  - **Pasted**: paste events detected (`pastes > 0`)
  - **Too Short**: final text longer than recorded keypresses (`text.length > keypresses`)
- **Interactive Review**: Color-coded keystroke timeline for each participant, showing normal keys, backspaces (red), paste events (blue), copy events (green), and modifier keys (purple)
- **Human-in-the-Loop**: Confirm or override automated flags, add notes per participant
- **One-Click Export**: Export flagged-participants report, cleaned dataset, or full keystroke report as CSV
- **Anonymize IDs**: One-click button to replace participant IDs with P1, P2, P3...
- **Light/Dark Theme**: Toggle between themes for comfortable viewing
- **Privacy by Design**: All processing happens client-side in your browser. No data is sent to any server.

## Quick Start

1. Visit the [live dashboard](https://keystroke-viz-anon.vercel.app/) or open `index.html` locally
2. Upload a CSV file containing keystroke data (or click "Load Sample Data" to try it out)
3. Review flagged participants in the **Review Keystrokes** tab
4. Confirm or override flags in the **Finalize & Export** tab
5. Export your cleaned dataset

## Input Format

The dashboard accepts CSV files with keystroke log data stored as JSON strings. It automatically detects:

- **Qualtrics exports**: Recognizes three-row header structure (column names, labels, import IDs with QID mappings)
- **Generic CSV**: Any CSV with a column containing JSON keystroke log data

### Expected JSON Schema

```json
{
  "keypresses": 42,
  "pastes": 1,
  "copies": 0,
  "keystroke_order": ["H", "e", "l", "l", "o", "paste"],
  "text": "Hello world"
}
```

## SDK Integration

The SDK source code is included in the [`sdk/`](sdk/) directory, with ready-to-use adapters for Qualtrics, React, Vue, Angular, vanilla JavaScript, and PHP. See each adapter's README for integration instructions.

## Self-Hosting

```bash
git clone <repository-url>
cd aied-keystroke-viz
npm install
npm run build
npm start
```

Or deploy directly to Vercel with one click.

## License

MIT
