## Configuration page

-   [x] Remove "Splits" section title
-   [x] Change "Exercise" in the default duration picker to "Work"
-   [x] DEBUG AND FIX - When entering an exercise title, if you select the
        duration for that exercise, it ends up "saving" that exercise, creating
        a new exercise, and then the duration you select is selected on the new
        exercise. NOTE: If I had to guess, this is because we still have a split
        between "existing" and "new" exercises - this split is no longer
        necessary now that the existing exercises are editable in-line. We could
        just have everything be considered an "existing" exercise, and clean up
        any code related to the "new" part of it.
-   [x] Update the "Delete" buttons to be an SVG icon of a garbage can. Feel
        free to use an SVG icon library for this.
-   [x] Make the new exercise button half the size it is now.
-   [x] Make the "Start workout" button fixed to the bottom of the page, but
        make sure users can still scroll all the way down to the page.
-   [x] Reduce the height of
-   [x] Move the "Add Split" button to below the splits.
-   [x] Move the "sets" selection to where the split's title is now, and just
        remove the split's title altogether.
-   [x] Make the default duration and sets selects match the select used on the
        exercises - I like the green look.
-   [x] Improve mobile sizing of exercises
    -   [x] Reduce the size of the select on the exercise - it only needs to
            ever fit 3 digits, and we should maximize the space given to other
            elements.
    -   [x] Slightly reduce the size of the l/r checkbox.
    -   [x] The delete button should already be smaller after changing it to a
            garbage can icon, but make sure there's not execessive padding
            around the garbage
    -   [x] Make splits take up the full width of the screen (so there's no left
            and right padding). This'll make them not look like "cards" anymore,
            so let's just make them the same color as the background, but have a
            single line divider between each split. The "new split" button
            should be after the last divider too
-   [x] Remove the "sectioning" of the exercises and the default durations. Just
        make the durations sit on the top of the page, with a single line
        divider between them and the splits, similar looking to the splits, but
        maybe this one goes full width of the page while the split's dividers
        are like 80% of the width.
-   [x] Remove the "Add at least one exercise to start your workout", just
        disable the start button instead.
-   [x] It should not be possible to delete the only exercise in a split, and if
        a split has no exercises, it should default to an empty one.
-   [x] Remove the Delete button for the first split, since users shouldn't be
        able to delete the only split.
-   [x] Move the add new exercise button to the top of the split section, to the
        left of the delete button.

## Timer page

-   [x] Model this page to be 100vh of the screen.
-   [x] Remove the "Back to configuration" text on the button, and just have it
        be the arrow. Remove the border, but make the arrow a little bigger than
        it is now.
-   [x] Make the time left a brighter white, but still slightly off-white.
-   [x] Move the "Total Remaining" inside the ring too, and remove the "Total
        Remaining" - just make sure this is smaller than the round's countdown.
-   [x] Make the Pause/Resume button a simple SVG icon of a pause/play button.
-   [x] Remove the "Exercise" text above the ring. The title that says the
        exercise suffices to say either the exercise or rest.
-   [x] DEBUG AND FIX - the ring's progress only moves once a second. It should
        move smoothly, so maybe it needs its own ticker (but make sure it still
        pauses)
-   [x] Display the total number of rounds left (above the countdown, not too
        large, the countdown should still be the largest thing in there)
