/**
 * Keystroke Tracker - React Adapter
 *
 * Provides a useKeystrokeTracker hook and a KeystrokeTrackedTextarea component.
 *
 * Usage:
 *   import { useKeystrokeTracker, KeystrokeTrackedTextarea } from 'keystroke-tracker-sdk/adapters/react';
 */

import { useRef, useEffect, useCallback } from 'react';
import KeystrokeTracker from '../../src/core';

/**
 * React hook for keystroke tracking.
 *
 * @param {Object} [options] - KeystrokeTracker options
 * @param {boolean} [options.trackFocusBlur=false]
 * @param {boolean} [options.trackTimestamps=false]
 * @returns {{ ref: React.RefObject, getData: () => Object, reset: () => void, tracker: KeystrokeTracker }}
 *
 * @example
 *   function MyForm() {
 *     const { ref, getData } = useKeystrokeTracker({ trackTimestamps: true });
 *     const handleSubmit = () => {
 *       const keystrokeData = getData();
 *       console.log(keystrokeData);
 *     };
 *     return <textarea ref={ref} />;
 *   }
 */
export function useKeystrokeTracker(options) {
  const ref = useRef(null);
  const trackerRef = useRef(null);

  useEffect(() => {
    const tracker = new KeystrokeTracker(options);
    trackerRef.current = tracker;

    if (ref.current) {
      tracker.attach(ref.current);
    }

    return () => {
      tracker.detach();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = useCallback(() => {
    return trackerRef.current ? trackerRef.current.getData() : null;
  }, []);

  const reset = useCallback(() => {
    if (trackerRef.current) trackerRef.current.reset();
  }, []);

  return { ref, getData, reset, tracker: trackerRef };
}

/**
 * Pre-built tracked textarea component.
 *
 * @example
 *   <KeystrokeTrackedTextarea
 *     trackTimestamps
 *     onSubmitData={(data) => sendToServer(data)}
 *     placeholder="Type here..."
 *   />
 */
export function KeystrokeTrackedTextarea({ onSubmitData, trackFocusBlur, trackTimestamps, ...textareaProps }) {
  const { ref, getData } = useKeystrokeTracker({ trackFocusBlur, trackTimestamps });

  const handleBlur = (e) => {
    if (onSubmitData) {
      onSubmitData(getData());
    }
    if (textareaProps.onBlur) textareaProps.onBlur(e);
  };

  return <textarea {...textareaProps} ref={ref} onBlur={handleBlur} />;
}

export { KeystrokeTracker };
export default useKeystrokeTracker;
