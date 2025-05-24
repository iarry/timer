## Configuration page

- [x] Enhance the ability to save and load workouts, see spec below.
  - For now, all saved workouts should just go to local storage. In the future, we'll use firestore or another simple DB.
  - For now, we can put the save and load buttons in the settings panel.
  - When saving, you should be able to name it
  - When loading, you should be taken to a new page with a list of saved workouts.
  - You should be able to edit the name of a saved workout.
  - If you load a workout and edit it, when you go to save it, it should have two save options: "update <name of workout>" (which overwrites the existing one), and "save new"
  - We can populate one default saved workout, which is in the sample workouts.
    - Also update that sample workout to be named "r/calisthenics recommended routine" and contain this workout (all default time):
        - 1st split
            - Pull-up
            - Squat
        - 2nd split
            - Dips
            - Hinge
        - 3rd split
            - Row
            - Push-up
        - Core
            - Plank
            - Copenhagen plank (l/r)
            - Reverse hyperextension
-  [x] You should be able to delete the current workout, it would just result in the user seeing a freshly empty workout.
-  [x] Move the "current" badge to be on the border of the item, in the top left. So it's halfway on the item and halfway off.
-  [x] "Workout Library" -> "Workouts"
-  [x] "Enter workout name" -> "Workout Name"
-  [x] When saving an existing workout, remove the entire `update-section`, and instead, just populate the name input with the existing title, and add another button, so there's three: Cancel, Save New, and Update. Save New should be styled as outlined - so that "Update" appears primary.
-  [x] "Save as new workout" -> "Save Workout"
-  [x] Clicking outside the "Save Workout" and "Workout Library" modals should close them.
-  [x] The save workout and load workout buttons are appearing on top of eachother, can you put them in a list with the "Sign in with google" button?
-  [ ] The "Save new" and "Update" buttons should be green.
-  [ ] Remove the "Workout Name" label above the input.
-  [ ] When loading the last used workout, it should know whether it's loading a saved workout.
-  [ ] Get rid of the settings sidebar, and button. See notes below
   - Move the Save button to where the settings button is now. Use the `save` icon as the button, styled similarly to how the setting button was.
   - Move the load button to the left of the start workout button, and use the `gallery-vertical-end` icon as the button, but rotate the icon 180 degrees.
   - Neither of these buttons need to appear on the timer page

## Timer page

-  [ ] On the timer page, replace the "Settings" button with a "back" button (using the `undo` icon), which resets the current countdown.

## Settings

None
