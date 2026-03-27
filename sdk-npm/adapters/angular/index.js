// Angular adapter - see SDK documentation for integration
// The TypeScript source is available at: https://anonymous.4open.science/r/aied-keystroke-viz/sdk/adapters/angular/keystroke-tracker.directive.ts
export class KeystrokeTrackerService {
  constructor() {}
  track(element) {
    if (typeof window !== 'undefined' && window.KeystrokeTracker) {
      return new window.KeystrokeTracker().track(element);
    }
    return { getData: () => null };
  }
}
