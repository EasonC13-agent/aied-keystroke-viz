/**
 * Keystroke Tracker - Angular Directive
 *
 * Usage:
 *   1. Import KeystrokeTrackerModule in your module
 *   2. Add the directive to any textarea or input:
 *      <textarea keystrokeTracker [trackerOptions]="{ trackTimestamps: true }"
 *                (keystrokeData)="onData($event)"></textarea>
 */

import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgModule } from '@angular/core';

// Import core - adjust path based on your setup
// import KeystrokeTracker from 'keystroke-tracker-sdk/src/core';
declare var KeystrokeTracker: any;

@Directive({
  selector: '[keystrokeTracker]'
})
export class KeystrokeTrackerDirective implements OnInit, OnDestroy {
  @Input() trackerOptions: {
    trackFocusBlur?: boolean;
    trackTimestamps?: boolean;
  } = {};

  @Output() keystrokeData = new EventEmitter<any>();

  private tracker: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.tracker = new KeystrokeTracker(this.trackerOptions);
    this.tracker.attach(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.tracker) {
      this.tracker.detach();
    }
  }

  /** Call this to get current tracking data */
  getData(): any {
    return this.tracker ? this.tracker.getData() : null;
  }

  /** Emit current data (can be triggered from parent via ViewChild) */
  emitData(): void {
    this.keystrokeData.emit(this.getData());
  }
}

@NgModule({
  declarations: [KeystrokeTrackerDirective],
  exports: [KeystrokeTrackerDirective]
})
export class KeystrokeTrackerModule {}
