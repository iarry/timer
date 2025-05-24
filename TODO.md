## Configuration page

- [ ] Enhance the ability to save and load workouts, see spec below.
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

## Timer page

None

## Settings

None
