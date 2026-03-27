/*
 * Qualtrics Keystroke Tracker - Header Script (v2.0)
 * 
 * This adapter wraps the platform-agnostic KeystrokeTracker core
 * for seamless use in Qualtrics surveys. The API is 100% backwards
 * compatible with v1.0: trackQuestion(this, options) works exactly
 * the same way.
 *
 * INSTALLATION:
 * 1. In Qualtrics, go to Survey Flow and add an Embedded Data element
 *    at the very top with a field named "keystroke_log" (leave value blank).
 * 2. Go to Look & Feel > General > Header > Edit > Source
 * 3. Paste the contents of this file wrapped in <script> tags:
 *    <script> ...paste here... </script>
 *
 *    Or use two script tags:
 *    <script src="dist/keystroke-core.min.js"></script>
 *    <script src="dist/keystroke-qualtrics.min.js"></script>
 *
 * 4. For each question you want to track, go to the question's JavaScript
 *    and add:
 *    Qualtrics.SurveyEngine.addOnload(function() {
 *      trackQuestion(this);
 *    });
 *
 * OPTIONS (pass as second argument to trackQuestion):
 *   trackQuestion(this, { trackFocusBlur: true, trackTimestamps: true });
 */

// ---- Inline Core (for single-file usage) ----
// If KeystrokeTracker is already loaded via a separate script tag, this is skipped.
if (typeof window.KeystrokeTracker === 'undefined') {
  // Paste the contents of dist/keystroke-core.min.js here,
  // or include it via a separate <script> tag before this file.
  console.warn('[KeystrokeTracker] Core not loaded. Include keystroke-core.min.js before this script, or use the combined dist/keystroke-tracker.min.js');
}

window.trackQuestion = function(context, options) {
  var opts = Object.assign({
    trackFocusBlur: false,
    trackTimestamps: false,
    fieldName: 'keystroke_log'
  }, options || {});

  var qid = context.questionId;
  var container = context.getQuestionContainer();
  var input = container.querySelector('textarea, input[type="text"]');
  if (!input) return;

  // Use core tracker
  var tracker = new KeystrokeTracker({
    trackFocusBlur: opts.trackFocusBlur,
    trackTimestamps: opts.trackTimestamps
  });
  tracker.attach(input);

  // On page submit, serialize and store in Qualtrics embedded data
  Qualtrics.SurveyEngine.addOnPageSubmit(function() {
    var data = tracker.getData();
    var questionRecord = {
      qid: qid,
      keypresses: data.keypresses,
      pastes: data.pastes,
      copies: data.copies,
      keystroke_order: data.keystroke_order,
      text: data.text
    };

    if (opts.trackFocusBlur) {
      questionRecord.focus_events = data.focus_events;
      questionRecord.blur_events = data.blur_events;
    }
    if (opts.trackTimestamps) {
      questionRecord.duration_ms = data.duration_ms;
    }

    // Append to cumulative embedded data field
    var raw = Qualtrics.SurveyEngine.getEmbeddedData(opts.fieldName);
    var master = { data: [] };
    try {
      if (raw && raw.trim() !== '') master = JSON.parse(raw);
    } catch (e) {
      master = { data: [] };
    }
    master.data.push(questionRecord);
    Qualtrics.SurveyEngine.setEmbeddedData(opts.fieldName, JSON.stringify(master));

    tracker.detach();
  });
};
