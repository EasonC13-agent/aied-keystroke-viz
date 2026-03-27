# Angular Adapter

Keystroke tracking for Angular applications via a directive.

## Setup

1. Include the core library in your project (via npm or script tag)
2. Import the module:

```typescript
import { KeystrokeTrackerModule } from 'keystroke-tracker-sdk/adapters/angular/keystroke-tracker.directive';

@NgModule({
  imports: [KeystrokeTrackerModule],
  // ...
})
export class AppModule {}
```

## Usage

```html
<textarea
  keystrokeTracker
  [trackerOptions]="{ trackTimestamps: true, trackFocusBlur: true }"
  #trackerDirective="keystrokeTracker"
  placeholder="Type your answer...">
</textarea>
<button (click)="submit()">Submit</button>
```

```typescript
import { Component, ViewChild } from '@angular/core';
import { KeystrokeTrackerDirective } from 'keystroke-tracker-sdk/adapters/angular/keystroke-tracker.directive';

@Component({ /* ... */ })
export class SurveyComponent {
  @ViewChild('trackerDirective') tracker!: KeystrokeTrackerDirective;

  submit() {
    const data = this.tracker.getData();
    // data = { keypresses, pastes, copies, keystroke_order, text, ... }
    this.http.post('/api/keystroke-data', data).subscribe();
  }
}
```

## Output Schema

Same as core: `{ keypresses, pastes, copies, keystroke_order, text, ... }`
