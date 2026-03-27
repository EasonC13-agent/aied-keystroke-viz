/**
 * Keystroke Tracker - Core Library (Platform-Agnostic)
 *
 * Tracks keystrokes, paste events, copy events, and focus/blur events
 * on any textarea or input element. No platform-specific dependencies.
 *
 * Output schema is compatible with the original Qualtrics version:
 *   { keypresses, pastes, copies, keystroke_order, text, focus_events, blur_events, duration_ms }
 *
 * Reference: Anonymous Authors. Keystroke tracking
 * in Qualtrics. Advances in Methods and Practices in Psychological Science.
 * DOI: 10.1177/25152459261424723
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.KeystrokeTracker = factory();
  }
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /**
   * @param {Object} [options]
   * @param {boolean} [options.trackFocusBlur=false] - Track tab focus/blur via visibilitychange
   * @param {boolean} [options.trackTimestamps=false] - Add ms timestamps to each event
   */
  function KeystrokeTracker(options) {
    this._opts = {
      trackFocusBlur: false,
      trackTimestamps: false
    };
    if (options) {
      for (var k in options) {
        if (options.hasOwnProperty(k)) this._opts[k] = options[k];
      }
    }

    this._element = null;
    this._startTime = null;
    this._data = null;
    this._handlers = {};
    this._attached = false;

    this.reset();
  }

  KeystrokeTracker.prototype.reset = function () {
    this._data = {
      keypresses: 0,
      pastes: 0,
      copies: 0,
      keystroke_order: [],
      focus_events: [],
      blur_events: []
    };
    this._startTime = Date.now();
  };

  /**
   * Attach tracking to a DOM element (textarea or input).
   * @param {HTMLElement} element
   */
  KeystrokeTracker.prototype.attach = function (element) {
    if (this._attached) this.detach();

    this._element = element;
    this._startTime = Date.now();
    this._attached = true;

    var self = this;
    var opts = this._opts;

    function ts() {
      return opts.trackTimestamps ? Date.now() - self._startTime : undefined;
    }

    this._handlers.keyup = function (e) {
      self._data.keypresses++;
      self._data.keystroke_order.push(
        opts.trackTimestamps ? { key: e.key, t: ts() } : e.key
      );
    };

    this._handlers.paste = function () {
      self._data.pastes++;
      self._data.keystroke_order.push(
        opts.trackTimestamps ? { key: 'paste', t: ts() } : 'paste'
      );
    };

    this._handlers.copy = function () {
      self._data.copies++;
      self._data.keystroke_order.push(
        opts.trackTimestamps ? { key: 'copy', t: ts() } : 'copy'
      );
    };

    element.addEventListener('keyup', this._handlers.keyup);
    element.addEventListener('paste', this._handlers.paste);
    element.addEventListener('copy', this._handlers.copy);

    if (opts.trackFocusBlur && typeof document !== 'undefined') {
      this._handlers.visibility = function () {
        var t = opts.trackTimestamps ? ts() : Date.now();
        if (document.hidden) {
          self._data.blur_events.push(t);
          self._data.keystroke_order.push(
            opts.trackTimestamps ? { key: 'blur', t: ts() } : 'blur'
          );
        } else {
          self._data.focus_events.push(t);
          self._data.keystroke_order.push(
            opts.trackTimestamps ? { key: 'focus', t: ts() } : 'focus'
          );
        }
      };
      document.addEventListener('visibilitychange', this._handlers.visibility);
    }
  };

  /** Detach all event listeners. */
  KeystrokeTracker.prototype.detach = function () {
    if (!this._attached) return;

    if (this._element) {
      this._element.removeEventListener('keyup', this._handlers.keyup);
      this._element.removeEventListener('paste', this._handlers.paste);
      this._element.removeEventListener('copy', this._handlers.copy);
    }

    if (this._handlers.visibility && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._handlers.visibility);
    }

    this._handlers = {};
    this._attached = false;
  };

  /**
   * Get tracking data as a plain object.
   * Schema: { keypresses, pastes, copies, keystroke_order, text,
   *           focus_events?, blur_events?, duration_ms? }
   */
  KeystrokeTracker.prototype.getData = function () {
    var result = {
      keypresses: this._data.keypresses,
      pastes: this._data.pastes,
      copies: this._data.copies,
      keystroke_order: this._data.keystroke_order.slice(),
      text: this._element ? this._element.value || '' : ''
    };

    if (this._opts.trackFocusBlur) {
      result.focus_events = this._data.focus_events.slice();
      result.blur_events = this._data.blur_events.slice();
    }

    if (this._opts.trackTimestamps) {
      result.duration_ms = Date.now() - this._startTime;
    }

    return result;
  };

  /** Get data as a JSON string. */
  KeystrokeTracker.prototype.toJSON = function () {
    return JSON.stringify(this.getData());
  };

  /** Check if currently attached. */
  KeystrokeTracker.prototype.isAttached = function () {
    return this._attached;
  };

  // Static version
  KeystrokeTracker.VERSION = '2.0.0';

  return KeystrokeTracker;
});
