/**
 * Keystroke Tracker - Vue 3 Adapter
 *
 * Provides a composable (useKeystrokeTracker) and a directive (vTrackKeystrokes).
 */

import { ref, onMounted, onBeforeUnmount } from 'vue';
import KeystrokeTracker from '../../src/core';

/**
 * Vue 3 Composable
 *
 * @example
 *   <script setup>
 *   import { useKeystrokeTracker } from 'keystroke-tracker-sdk/adapters/vue';
 *   const { elementRef, getData, reset } = useKeystrokeTracker({ trackTimestamps: true });
 *   </script>
 *   <template>
 *     <textarea ref="elementRef" />
 *     <button @click="console.log(getData())">Get Data</button>
 *   </template>
 */
export function useKeystrokeTracker(options) {
  const elementRef = ref(null);
  let tracker = null;

  onMounted(() => {
    tracker = new KeystrokeTracker(options);
    if (elementRef.value) {
      tracker.attach(elementRef.value);
    }
  });

  onBeforeUnmount(() => {
    if (tracker) tracker.detach();
  });

  function getData() {
    return tracker ? tracker.getData() : null;
  }

  function reset() {
    if (tracker) tracker.reset();
  }

  return { elementRef, getData, reset };
}

/**
 * Vue 3 Directive
 *
 * @example
 *   // Register globally:
 *   app.directive('track-keystrokes', vTrackKeystrokes);
 *
 *   // Usage in template:
 *   <textarea v-track-keystrokes="{ trackTimestamps: true }" />
 *
 *   // Access data via the element's __keystrokeTracker property:
 *   this.$refs.myTextarea.__keystrokeTracker.getData()
 */
export const vTrackKeystrokes = {
  mounted(el, binding) {
    const options = binding.value || {};
    const tracker = new KeystrokeTracker(options);
    tracker.attach(el);
    el.__keystrokeTracker = tracker;
  },
  beforeUnmount(el) {
    if (el.__keystrokeTracker) {
      el.__keystrokeTracker.detach();
      delete el.__keystrokeTracker;
    }
  }
};

export { KeystrokeTracker };
export default useKeystrokeTracker;
