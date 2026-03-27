// Add this to each question's JavaScript in Qualtrics
// (Click on the question > Add JavaScript)

// Basic usage:
Qualtrics.SurveyEngine.addOnload(function() {
  trackQuestion(this);
});

// With all options enabled:
// Qualtrics.SurveyEngine.addOnload(function() {
//   trackQuestion(this, {
//     trackFocusBlur: true,    // Track tab switches
//     trackTimestamps: true    // Add ms timestamps to events
//   });
// });
