/**
 * Qualtrics Keystroke Tracker SDK
 * 
 * Tracks keystrokes, paste events, copy events, and focus/blur events
 * for open-ended questions in Qualtrics surveys. Designed to detect
 * outsourced responding (e.g., AI-generated text pasted from ChatGPT).
 *
 * Usage in Qualtrics:
 *   1. Paste the header script (see qualtrics/header.js) into
 *      Look & Feel > General > Header > Edit > Source
 *   2. For each tracked question, add to the question's JavaScript:
 *      Qualtrics.SurveyEngine.addOnload(function() {
 *        trackQuestion(this);
 *      });
 *
 * Reference: Anonymous Authors. Keystroke tracking
 * in Qualtrics. Advances in Methods and Practices in Psychological Science.
 * DOI: 10.1177/25152459261424723
 */

(function(global) {
  'use strict';

  /**
   * Track a single Qualtrics question.
   * @param {Object} context - The Qualtrics question context (`this` in addOnload)
   * @param {Object} [options] - Optional configuration
   * @param {boolean} [options.trackFocusBlur=false] - Track tab focus/blur events
   * @param {boolean} [options.trackTimestamps=false] - Record timestamps for each event
   * @param {string} [options.fieldName='keystroke_log'] - Embedded data field name
   */
  function trackQuestion(context, options) {
    var opts = Object.assign({
      trackFocusBlur: false,
      trackTimestamps: false,
      fieldName: 'keystroke_log'
    }, options || {});

    var qid = context.questionId;
    var container = context.getQuestionContainer();
    var input = container.querySelector('textarea, input[type="text"]');
    if (!input) return;

    var qData = {
      keypresses: 0,
      pastes: 0,
      copies: 0,
      keystroke_order: [],
      focus_events: [],
      blur_events: []
    };

    var startTime = Date.now();

    function timestamp() {
      return opts.trackTimestamps ? Date.now() - startTime : undefined;
    }

    // Track keystrokes
    input.addEventListener('keyup', function(e) {
      qData.keypresses++;
      var entry = e.key;
      if (opts.trackTimestamps) {
        entry = { key: e.key, t: timestamp() };
      }
      qData.keystroke_order.push(entry);
    });

    // Track paste events
    input.addEventListener('paste', function() {
      qData.pastes++;
      var entry = 'paste';
      if (opts.trackTimestamps) {
        entry = { key: 'paste', t: timestamp() };
      }
      qData.keystroke_order.push(entry);
    });

    // Track copy events
    input.addEventListener('copy', function() {
      qData.copies++;
      var entry = 'copy';
      if (opts.trackTimestamps) {
        entry = { key: 'copy', t: timestamp() };
      }
      qData.keystroke_order.push(entry);
    });

    // Optional: track focus/blur (tab switching)
    if (opts.trackFocusBlur) {
      document.addEventListener('visibilitychange', function() {
        var t = opts.trackTimestamps ? timestamp() : Date.now();
        if (document.hidden) {
          qData.blur_events.push(t);
          qData.keystroke_order.push(opts.trackTimestamps ? { key: 'blur', t: timestamp() } : 'blur');
        } else {
          qData.focus_events.push(t);
          qData.keystroke_order.push(opts.trackTimestamps ? { key: 'focus', t: timestamp() } : 'focus');
        }
      });
    }

    // On page submit, serialize and store
    Qualtrics.SurveyEngine.addOnPageSubmit(function() {
      var questionRecord = {
        qid: qid,
        keypresses: qData.keypresses,
        pastes: qData.pastes,
        copies: qData.copies,
        keystroke_order: qData.keystroke_order,
        text: input.value
      };

      if (opts.trackFocusBlur) {
        questionRecord.focus_events = qData.focus_events;
        questionRecord.blur_events = qData.blur_events;
      }

      if (opts.trackTimestamps) {
        questionRecord.duration_ms = Date.now() - startTime;
      }

      // Append to cumulative embedded data field
      var raw = Qualtrics.SurveyEngine.getEmbeddedData(opts.fieldName);
      var master = { data: [] };
      try {
        if (raw && raw.trim() !== '') {
          master = JSON.parse(raw);
        }
      } catch (e) {
        master = { data: [] };
      }

      master.data.push(questionRecord);
      Qualtrics.SurveyEngine.setEmbeddedData(opts.fieldName, JSON.stringify(master));
    });
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { trackQuestion: trackQuestion };
  }
  global.trackQuestion = trackQuestion;

})(typeof window !== 'undefined' ? window : this);
