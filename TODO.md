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
-   [x] Make the gabage icons just the icons as red, instead of being a filled
        box.
-   [x] Make the add new exercise button the same size as the delete, and give
        them a little spacing between eachother.
-   [x] Make the "Sets" input a select, and go from 1-20 with 3 as the default.
-   [x] Make the "Sets" and default selects use the same select that the
        exercise's select does. I like the exercise's version better, where
        there's no outline or background color - just the number and chevron.
-   [x] Remove the dividing line between splits.
-   [x] Remove the top margin of the exercise list.
-   [x] Reduce the padding on the default settings.
-   [x] Change "Work" is defeault settings to "Default work"
-   [x] Remove the "sec"s in the default settings
-   [x] Instead of hiding the delete button on the last remaining split, just
        disable it (visually too).
-   [x] Make the start workout button just say "Start", and remove about half
        the padding on the left and right, and remove a quarter of the vertical
        padding.
-   [x] Remove the bottom margin on the Start button
-   [x] Remove the bottom margin on the split header.
-   [x] Remove the top padding of the add-split-section.
-   [x] Remove the line below the add split
-   [x] Move the settings button to the right of the start button, and make the
        start button centered on the horizontal page. We can put an empty
        element to the left of the start button to space it evenly.
-   [x] Make the start button's min-width 120px.
-   [x] Make the default setting's selects use the same select that's used for
        the exercises and sets select.
-   [x] Make the add exercise button green, and make the + icon larger - font
        size 16px, padding 4px 8px.
-   [x] Update the start and add split buttons to use the same green as the
        selects. This should be the only green used throughout the app. Make it
        a CSS variable.
-   [x] Make the space between the start, settings, and the placeholder equal
        with the edges of the screen.
-   [x] DEBUG the new exercise button is still showing red, there seems to be a
        conflicting CSS rule with !important on it
        ✅ FIXED: Updated selector to `.split-actions .add-exercise-button.btn.btn-small` 
        to override the red color from `.split-actions .btn.btn-small` rule

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
-   [x] Center all of the text inside the ring. It should have the countdown in
        the dead center, then the round above and the total time below.
-   [x] Update the rounds display to include the total number, e.g. "Round 1/30"
-   [x] Remove the highlight on the pause button when paused
-   [x] Make the pause / resume button just the icon, without a circle around
        it. The icon should be slightly smaller the current circle.
-   [x] Move the "Rounds" display up a little bit, to have the same space
        between the count down that the total remaining time has.
-   [x] Make the pause/play icon take up the entire size of the button, and make
        it green (the same green we just made the only green across the app).
-   [x] The play/pause button should be in the center of the page horizontally,
        with the settings button to the right of it. We can add a "mute" button
        to the left of the play/pause button, same size as the settings button.
-   [x] Make the ring progress green (the same green we just made the only green
        across the app). The progress when resting should be off-white, and the
        ring's un-filled/progressed section should be a light grey.
-   [x] Make the space between the mute, play, and settings button equal with
        the edges of the screen.
-   [x] Remove the orange highlight that happens after pressing the pause
        button.
-   [x] Fill the pause/play button's paths, e.g. so the play button is solid
        without a background.
-   [x] DEBUG AND FIX - the rounds info didn't move up on your last try

## Settings

-   [x] Update the hamburger icon to be a gear cog icon.
-   [x] On the configuration page, move the settings button to the floating
        section with the start button, and make it on the right side
-   [x] Move the settings button on the timer page to be horizontally in line
        with the play/pause button, but keep it smaller and to the right. It
        should also be vertically aligned, even though it's smaller, the
        centeres of the buttons should be at the same Y.
-   [x] Remove the settings button that's on the top right of the page.
