## Configuration page

- [x] Add a button for "new workout" when on the load workout modal
- [x] Add a note above the list of saved workouts along the lines of "Edits to saved workouts are not saved automatically".
- [x] The "Save New" button on the saved workout list modal should be green in the outline style - the cancel and update buttons are styled correctly, don't change those.
- [x] Improve the stlying of the audio profile select - it looks very basi right now. Perhaps use the same style select as the rest of the page.
- [x] There's a small bug with the "test audio" button, where an icon is off center while playing
- [x] Create reusable Select component to standardize all select styling across the app
- [x] Move workout note to WorkoutLibrary modal header for better UX
- [x] Disable service worker in development to prevent caching issues
- [x] Add the ability to drag and drop an entire set, to re-order the sets.
- [x] Add a "Warmup" duration, with increments of 15s, defaulting to 3 minutes. It's configuration should be just below but part of the default settings, and it should occur before the rest of the workout a single time.
- [x] **Dual audio profiles** - Implement dual audio profile system where each existing audio profile (Clean, Pixel, Serenity) has two user-visible versions: the original tone-based version and a new speech synthesis version that reads exercise names aloud before the countdown instead of playing the `exerciseStart` sound. Display these as "Clean" and "Clean (tones only)", etc.

## Timer page

- [x] Move the play/pause button up on the screen
- [x] Make the ring larger, almost to the width of the screen.
- [x] Increase the font size of both the current exercise and the next exercise.
- [x] FIX there's no rest inbetween splits (make sure there isn't one added at the end of the workout though)
- [x] After finishing the workout, remove the "Restart workout" button. Just have some no-fluff encouraging copy. Maybe have a list of congradulatory or encouraging things to say - base them slightly on spiritual/eastern philosphy but all kind of david goggin's "stay hard!" like.
- [x] DEBUG - something is broken with the sound on my phone. It seems to drop out at times, or lose its place. For example, if I start a workout and then switch apps it might not be playing again, but then sometimes switching and coming back again will restore the sound. Maybe it's getting lost or attached to some event that's not always firing?

## Settings

None

## ✅ Completed Refactoring

- [x] **Major code complexity reduction refactor** - Reduced codebase from ~4750 to ~4277 lines (-470+ lines)
  - [x] Extracted SortableExercise component from ConfigPanel (599 → 426 lines, -173 lines)
  - [x] Removed unused samples slice and related code (-57 lines)
  - [x] Removed unused utility functions and hooks (-184 lines)  
  - [x] Consolidated Redux actions (removed renameWorkout, clearWorkout)
  - [x] Consolidated CSS styles (removed ~50+ lines of duplicate styles)
  - [x] Updated documentation to reflect removed features
