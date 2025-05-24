# CLAUDE.md - Guidelines for Timer project

## Project Overview

This is a HIIT timer that allows users to create custom workouts that support
the use case of multiple sets of different splits, largely based around the
recommended routine of r/calisthenics - where you do 3 sets of 2 exercises, 3
sets of 2 different exercises, 3 sets of another 2 exercises, and then 3 sets of
3 exercises, with varying times for each set or having one exercise include both
left and right sides.

## Code Structure

-   `src/` - Source code of the react app
    -   `app.tsx` - Main app entrypoint
    -   `index.css` - CSS styling
    -   `store.ts` - Redux store
    -   `firebase.ts` - Firebase config for auth & db usage

## Coding Standards

### TypeScript

-   Use ES6+ features where appropriate
-   Prefer const/let over var
-   Use clear, descriptive variable and function names
-   Add comments for complex logic
-   Use consistent indentation (2 spaces)

### CSS

-   Use descriptive class names
-   Organize styles logically
-   Use CSS variables for theme colors and repeated values
-   Ensure responsive design considerations

## Pull Request Guidelines

When creating pull requests:

1. Include clear descriptions of changes
2. Reference any related issues
3. Ensure code passes existing functionality
4. Include tests for new features when possible
5. Update documentation as needed

## Project-Specific Considerations

-   User experience is a priority - focus on intuitive interfaces
-   Provide clear error messages to users

## Security Considerations

-   Validate user input
-   Do not expose sensitive system information

## Feature Implementation Guidance

When implementing new features:

1. Maintain the existing architecture (React, Redux)
2. Follow the established UI/UX patterns
3. Consider both performance and usability
4. Add tests for new features
