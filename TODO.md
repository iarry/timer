## Configuration page

-   [ ] Remove "Splits" section title
-   [ ] Change "Exercise" in the default duration picker to "Work"
-   [ ] DEBUG AND FIX - When entering an exercise title, if you select the
        duration for that exercise, it ends up "saving" that exercise, creating
        a new exercise, and then the duration you select is selected on the new
        exercise. NOTE: If I had to guess, this is because we still have a split
        between "existing" and "new" exercises - this split is no longer
        necessary now that the existing exercises are editable in-line. We could
        just have everything be considered an "existing" exercise, and clean up
        any code related to the "new" part of it.
-   [ ] Update the "Delete" buttons to be an SVG icon of a garbage can. Feel
        free to use an SVG icon library for this.
-   [ ] Make the new exercise button half the size it is now.
-   [ ] Make the "Start workout" button fixed to the bottom of the page, but
        make sure users can still scroll all the way down to the page.
-   [ ] Reduce the height of
-   [ ] Move the "Add Split" button to below the splits.
-   [ ] Move the "sets" selection to where the split's title is now, and just
        remove the split's title altogether.
-   [ ] Make the default duration and sets selects match the select used on the
        exercises - I like the green look.
-   [ ] Improve mobile sizing of exercises
    -   [ ] Reduce the size of the select on the exercise - it only needs to
            ever fit 3 digits, and we should maximize the space given to other
            elements.
    -   [ ] Slightly reduce the size of the l/r checkbox.
    -   [ ] The delete button should already be smaller after changing it to a
            garbage can icon, but make sure there's not execessive padding
            around the garbage
    -   [ ] Make splits take up the full width of the screen (so there's no left
            and right padding). This'll make them not look like "cards" anymore,
            so let's just make them the same color as the background, but have a
            single line divider between each split. The "new split" button
            should be after the last divider too
-   [ ] Remove the "sectioning" of the exercises and the default durations. Just
        make the durations sit on the top of the page, with a single line
        divider between them and the splits, similar looking to the splits, but
        maybe this one goes full width of the page while the split's dividers
        are like 80% of the width.

## Timer page

-   [ ] Model this page to be 100vh of the screen.
-   [ ] Remove the "Back to configuration" text on the button, and just have it
        be the arrow. Remove the border, but make the arrow a little bigger than
        it is now.
-   [ ] Make the time left a brighter white, but still slightly off-white.
-   [ ] Move the "Total Remaining" inside the ring too, and remove the "Total
        Remaining" - just make sure this is smaller than the round's countdown.
-   [ ] Make the Pause/Resume button a simple SVG icon of a pause/play button.
-   [ ] Remove the "Exercise" text above the ring. The title that says the
        exercise suffices to say either the exercise or rest.
-   [ ] DEBUG AND FIX - the ring's progress only moves once a second. It should
        move smoothly, so maybe it needs its own ticker (but make sure it still
        pauses)
-   [ ] Display the total number of rounds left (above the countdown, not too
        large, the countdown should still be the largest thing in there)
