## MVP

-   [ ] Create a config component that allows users to configure their workout,
        and store the data in a "timerConfig" sore for redux
    -   [ ] Ability to configure a default exercise and rest duration (deault of
            45s & 30s)
    -   [ ] Ability to add, delete, and name an exercise
    -   [ ] Ability to customize the duration of the exercise
    -   [ ] Ability to configure the number of sets (default of 3) for the list
            of exercises
    -   [ ] Ability to create another "split" of exercises, with their own set
            number, and new list of exercises
-   [ ] Create a timer that uses the user's configuration to create a countdown.
        For now, just display a numerical countdown. It should start with the
        first exercise in the first split, use it's duration (or the default),
        then use the rest duration, then move on to the next exercise in the
        split. Once all sets of that split are complete, it moves on to the
        second split.
    -   [ ] Display the total remaining time of all rounds.
    -   [ ] Include a pause/resume button that pauses the countdown.
    -   [ ] Include a back button to go back to the configuration (it should
            load the current config)
    -   [ ] Create an SVG that's a ring, and it follows the countdown for the
            current countdown. So another progress SVG progresses and fills it
            in.
    -   [ ] Display the name of the current exercise.
