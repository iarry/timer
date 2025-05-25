## Configuration page

- [ ] Add a button for "new workout" when on the load workout modal
- [ ] Add a note above the list of saved workouts along the lines of "Edits to saved workouts are not saved automatically".
- [ ] The "Save New" button on the saved workout list modal should be green in the outline style - the cancel and update buttons are styled correctly, don't change those.
- [ ] Improve the stlying of the audio profile select - it looks very basi right now. Perhaps use the same style select as the rest of the page.
- [ ] There's a small bug with the "test audio" button, where an icon is off center while playing
- [ ] Add the ability to drag and drop an entire set, to re-order the sets.
- [ ] Add a "Warmup" duration, with increments of 15s, defaulting to 3 minutes. It's configuration should be just below but part of the default settings, and it should occur before the rest of the workout a single time.

## Timer page

- [ ] Move the play/pause button up on the screen
- [ ] Make the ring larger, almost to the width of the screen.
- [ ] Increase the font size of both the current exercise and the next exercise.
- [ ] FIX there's no rest inbetween splits (make sure there isn't one added at the end of the workout though)
- [ ] After finishing the workout, remove the "Restart workout" button. Just have some no-fluff encouraging copy. Maybe have a list of congradulatory or encouraging things to say - base them slightly on spiritual/eastern philosphy but all kind of david goggin's "stay hard!" like.
- [ ] DEBUG - something is broken with the sound on my phone. It seems to drop out at times, or lose its place. For example, if I start a workout and then switch apps it might not be playing again, but then sometimes switching and coming back again will restore the sound. Maybe it's getting lost or attached to some event that's not always firing?

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
