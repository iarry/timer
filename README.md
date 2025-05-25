# Vibe Timer App

A mobile-first interval training timer application built with React, Redux, and Firebase. This app allows users to create custom workout routines with configurable exercises, rest periods, and multiple splits.

## Recent Development Summary

This Vibe Timer application has been completely implemented with all core features and thoroughly tested. The project demonstrates modern React/TypeScript development practices with Redux state management and Firebase integration.

### Major Features Implemented

- **Inline Editable Exercise Lists**: Real-time editing with immediate Redux state updates
- **Left/Right Exercise Support**: Checkbox functionality that doubles exercise time with rest between sides
- **Visual Duration Indicators**: Exercises using default duration values are highlighted
- **Auto-updating Configurations**: When default durations change, exercises using defaults automatically update
- **Auto-initialization**: Split 1 is automatically created to eliminate empty states
- **Complete Mobile Design**: Dark theme with responsive layout optimized for workouts
- **Firebase Authentication**: Google OAuth integration with user profile management
- **Sound Effects**: Audio feedback for timer start, transitions, and completion
- **LocalStorage Persistence**: Workout configurations persist between sessions

### Technical Decisions Made

- **Redux Toolkit**: Chosen for complex state management with multiple interconnected slices
- **TypeScript**: Strict typing for better development experience and error prevention
- **CSS Variables**: Consistent theming system with mobile-first responsive design
- **Custom Hooks**: Sound effects abstracted into reusable hook with error handling
- **Error Boundaries**: Silent error handling for localStorage and audio playback failures
- **Modular Architecture**: Feature-based folder structure for scalability

### Code Quality Improvements

Recent cleanup included:
- Removed unused CSS animations and placeholder content
- Eliminated console.error statements in favor of silent error handling
- Fixed duplicate CSS rules
- Replaced Firebase hosting placeholder with proper production HTML
- Removed completed TODO file
- Updated page titles to be production-ready

## Implementation Details

The application has been implemented with several key features and components:

### Redux Store

The Redux store is divided into multiple slices:
- **timerConfigSlice**: Manages workout configuration (exercises, splits, durations)
- **timerSlice**: Manages timer state (countdown, current exercise, status)
- **samplesSlice**: Provides sample workout data for new users
- **userSlice**: Handles user authentication and profile

### Key Components

1. **ConfigPanel**: 
   - Configuration interface for workout settings
   - Exercise and split management
   - Default duration settings
   - Sample workout loading

2. **Timer**:
   - Circular progress indicator
   - Exercise display
   - Total workout time remaining
   - Pause/resume controls
   - Back button for navigation

3. **UserAuth**:
   - Google authentication integration
   - User profile display
   - Login/logout functionality

4. **Common Components**:
   - Button: Reusable button with variants (primary, secondary, danger, outline)
   - Input: Styled input fields with labels

### Application Flow

1. User configures workout by:
   - Setting default durations
   - Creating splits with exercises
   - Optionally loading a sample workout

2. User starts the workout using the "Start Workout" button
   - Timer automatically initiates
   - Sound plays on start, transitions, and completion

3. User can pause, resume, or return to configuration
   - Progress is maintained when navigating back to timer

### Setup Detailspt, Redux, and Firebase. This app allows users to create custom workout routines with configurable exercises, rest periods, and multiple splits.

## Features

- **Custom Workout Configuration**
  - Create multiple exercise splits with customizable sets
  - Configure exercise and rest durations
  - Add/remove exercises to each split
  - Load sample workouts for quick start

- **Timer Functionality**
  - Visual countdown with circular progress indicator
  - Exercise name and type display
  - Total remaining workout time
  - Pause/resume functionality
  - Sound effects for transitions

- **User Experience**
  - Mobile-first dark theme design
  - Intuitive navigation between configuration and timer
  - User authentication with Google
  - Save custom workouts to Firebase (coming soon)

- **Visual Design**
  - Dark theme with high-contrast colors
  - Bright red and green accent colors
  - Clean, minimal interface optimized for mobile

## Project Structure

### Core Technologies

- **Frontend**: React + TypeScript + Vite
- **State Management**: Redux Toolkit
- **Authentication & Database**: Firebase (Google OAuth)
- **Styling**: CSS with CSS Variables

### Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx   # Custom button component
│   │   ├── Input.tsx    # Custom input component
│   │   └── UserAuth.tsx # User authentication component
│   ├── config/          # Workout configuration components
│   │   ├── AudioProfileSelector.tsx
│   │   └── ConfigPanel.tsx
│   ├── timer/           # Timer components
│   │   └── Timer.tsx
│   └── workouts/        # Workout management components
│       ├── WorkoutLibrary.tsx
│       └── WorkoutSaveDialog.tsx
├── features/            # Redux slices by feature domain
│   ├── samples/         # Sample workouts
│   │   └── samplesSlice.ts
│   ├── savedWorkouts/   # Saved workout management
│   │   └── savedWorkoutsSlice.ts
│   ├── timer/           # Timer functionality
│   │   └── timerSlice.ts
│   └── timerConfig/     # Configuration state
│       └── timerConfigSlice.ts
├── hooks/               # Custom hooks
│   ├── useScreenWakeLock.ts
│   └── useSoundEffects.ts
├── middleware/          # Redux middleware
│   └── indexedDBMiddleware.ts  # Automatic state persistence
├── utils/               # Utility functions and systems
│   ├── audioProfiles.ts # Audio profile definitions
│   ├── audioSystem.ts   # Web Audio API integration
│   └── stateLoaders.ts  # App initialization and state restoration
├── App.tsx              # Main application component
├── firebase.ts          # Firebase initialization
├── hooks.ts             # Redux typed hooks
├── store.ts             # Redux store configuration
└── utils.ts             # General utility functions
```

## Design Decisions

### 1. Mobile-First Approach

The app is designed primarily for mobile usage during workouts:
- Simplified navigation that works well on small screens
- Touch-friendly buttons and inputs
- Responsive layout that adapts to different screen sizes

### 2. Redux State Management

Redux was chosen to manage the application state due to:
- Complex state relationships between timer and configuration
- Need for global state access across components
- Better separation of concerns with slice pattern
- Simplified debugging and state inspection

### 3. Dark Theme

A dark theme was implemented to:
- Reduce eye strain during workouts
- Provide better contrast in various lighting conditions
- Reduce battery consumption on OLED screens
- Create a modern, focused visual experience

### 4. Streamlined User Flow

The user experience was optimized to minimize friction:
- Direct navigation between configuration and timer
- Automatic durations update without explicit save actions
- Simplified split management with automatic numbering
- Visual consistency between editing and viewing exercises

## IndexedDB Middleware System

The Vibe Timer app uses a custom IndexedDB middleware system for automatic state persistence. This middleware automatically saves Redux state changes to the browser's IndexedDB, providing offline data persistence without requiring manual save operations.

### How It Works

The `indexedDBMiddleware` intercepts specific Redux actions and automatically persists the relevant state slices to IndexedDB. This ensures user data is preserved across browser sessions and provides offline functionality.

#### Architecture Overview

```
Redux Action → Middleware → IndexedDB Storage
                    ↓
            State Restoration on App Init
```

### Key Components

#### 1. IndexedDB Middleware (`src/middleware/indexedDBMiddleware.ts`)

The middleware defines which actions trigger persistence:

```typescript
// Actions that automatically trigger IndexedDB persistence
const PERSIST_ACTIONS = [
  'timerConfig/setDefaultDurations',
  'timerConfig/setAudioProfile',
  'timerConfig/addSplit',
  'timerConfig/removeSplit',
  // ... other actions
];
```

**Database Structure:**
- **Database Name**: `WorkoutTimerDB`
- **Object Stores**:
  - `timerConfig`: Stores workout configuration (splits, exercises, durations, audio profile)
  - `savedWorkouts`: Stores saved workout templates and current workout ID

#### 2. State Loaders (`src/utils/stateLoaders.ts`)

Handles automatic state restoration when the app initializes:

```typescript
export const initializeAppState = async () => {
  // Load timer configuration
  const timerConfig = await workoutDB.getItem('timerConfig', 'state');
  if (timerConfig) {
    store.dispatch(loadWorkout({
      splits: timerConfig.splits,
      defaultExerciseDuration: timerConfig.defaultExerciseDuration,
      defaultRestDuration: timerConfig.defaultRestDuration,
      audioProfile: timerConfig.audioProfile
    }));
  }
  
  // Load saved workouts and initialize audio system
  // ...
};
```

### Usage Examples

#### Adding Persistence to New Redux Actions

1. **Define the action in your slice:**

```typescript
// In your slice file (e.g., timerConfigSlice.ts)
export const setNewSetting = createAction<string>('timerConfig/setNewSetting');
```

2. **Add the action to the middleware:**

```typescript
// In indexedDBMiddleware.ts
const PERSIST_ACTIONS = [
  // ...existing actions
  'timerConfig/setNewSetting',
];
```

3. **The middleware automatically handles persistence** - no additional code needed!

#### Working with Persisted Data

The middleware automatically:
- **Saves**: When any action in `PERSIST_ACTIONS` is dispatched
- **Loads**: During app initialization via `initializeAppState()`
- **Handles Errors**: Gracefully degrades when IndexedDB is unavailable

#### Example: Audio Profile Persistence

The audio profile system demonstrates the middleware in action:

```typescript
// 1. User changes audio profile (dispatches Redux action)
dispatch(setAudioProfile('Serenity'));

// 2. Middleware automatically saves to IndexedDB
// 3. On next app load, state is automatically restored
// 4. Audio system is initialized with saved profile
```

### Best Practices

#### 1. Action Naming Convention
Use descriptive action names that clearly indicate the feature domain:
```typescript
'timerConfig/setAudioProfile'  // ✅ Clear domain and purpose
'setProfile'                   // ❌ Too generic
```

#### 2. State Shape Considerations
Keep persisted state serializable (no functions, classes, or complex objects):
```typescript
// ✅ Good - simple, serializable state
interface TimerConfigState {
  audioProfile: string;
  defaultExerciseDuration: number;
}

// ❌ Bad - contains non-serializable data
interface BadState {
  audioSystem: AudioSystem; // Class instance
  callback: () => void;     // Function
}
```

#### 3. Error Handling
The middleware uses silent error handling to ensure the app works even when IndexedDB is unavailable:
```typescript
// Middleware catches errors and continues normal operation
.catch(() => {
  // Silent failure - IndexedDB not available
});
```

### Debugging IndexedDB

#### 1. Browser DevTools
- **Chrome/Edge**: Application tab → Storage → IndexedDB → `WorkoutTimerDB`
- **Firefox**: Storage tab → IndexedDB → `WorkoutTimerDB`

#### 2. Programmatic Access
You can access the database directly for debugging:
```typescript
import { workoutDB } from '../middleware/indexedDBMiddleware';

// Get current timer config
const config = await workoutDB.getItem('timerConfig', 'state');
console.log('Current config:', config);
```

### Migration and Schema Changes

When updating the state structure:

1. **Update the middleware version** if needed:
```typescript
class WorkoutDB {
  private version = 2; // Increment for schema changes
}
```

2. **Handle migration in the `onupgradeneeded` event:**
```typescript
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  
  // Create new object stores or modify existing ones
  if (event.oldVersion < 2) {
    // Migration logic for version 2
  }
};
```

### Performance Considerations

- **Automatic Batching**: Middleware only persists when specific actions occur
- **Async Operations**: All IndexedDB operations are asynchronous and non-blocking
- **Size Limits**: IndexedDB has generous storage quotas (typically >50MB)
- **Error Recovery**: App continues to function even if persistence fails

This middleware system provides seamless data persistence without requiring manual save operations, making the user experience smooth while ensuring data reliability.

## Implementation Details

I’m building a React app with TypeScript, Redux Toolkit, and Firebase. Here’s
the setup so far:

-   Frontend: React + Vite + TypeScript
-   State management: Redux Toolkit
-   Auth & DB: Firebase (only need Google OAuth and ability to store a single
    string per user in Firestore)
-   Deployment: Firebase Hosting with GitHub Actions
-   Dev tools: VS Code + GitHub Copilot

✅ Setup Details

1.  Firebase SDK

-   Initialized in firebase.ts with initializeApp, getAuth, and getFirestore.
-   Using GoogleAuthProvider for sign-in.

2.  Redux Toolkit

-   store.ts defines the store and exports RootState and AppDispatch.
-   userSlice.ts defines a slice with a typed UserState and login/logout
    actions.
-   hooks.ts adds strongly-typed useAppSelector and useAppDispatch using import
    type.

3.  React Integration

-   main.tsx uses Vite-style imports (createRoot, StrictMode) and wraps the app
    in <Provider store={store}>.

4.  Git + GitHub

-   Git initialized and pushed to GitHub.
-   firebase init hosting:github used to enable automatic deploys.
-   Fixed errors like:
-   Firebase App Hosting requiring billing (used classic Hosting instead)
-   Missing service account for GitHub deploys (fixed with re-init)
-   TS error requiring import type due to verbatimModuleSyntax: true

5.  TypeScript Best Practices

-   .ts used for logic/util files, .tsx used for files containing JSX
-   import type used where necessary to satisfy strict module syntax

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
    uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
    uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the
configuration to enable type-aware lint rules:

```js
export default tseslint.config({
    extends: [
        // Remove ...tseslint.configs.recommended and replace with this
        ...tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        ...tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
        // other options...
        parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },
})
```

You can also install
[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
and
[eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)
for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
    plugins: {
        // Add the react-x and react-dom plugins
        'react-x': reactX,
        'react-dom': reactDom,
    },
    rules: {
        // other rules...
        // Enable its recommended typescript rules
        ...reactX.configs['recommended-typescript'].rules,
        ...reactDom.configs.recommended.rules,
    },
})
```

## Future Enhancements

- **UI Improvements**
  - Add animations for exercise transitions
  - Implement haptic feedback for mobile devices
  - Enhance visual feedback during workouts

- **Feature Additions**
  - Persist workouts to Firebase
  - Add workout history and statistics
  - Support different workout types (Tabata, EMOM, etc.)
  - Allow sharing workouts between users

- **Technical Improvements**
  - Add comprehensive test coverage
  - Optimize for PWA functionality
  - Improve accessibility features

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

### Manual Testing Instructions

After running `npm run dev`, test the following functionality:

#### 1. Initial Setup and Configuration
- [ ] Open `http://localhost:5173` in your browser
- [ ] Verify dark theme loads correctly
- [ ] Check that "Split 1" is automatically created and ready for exercise input
- [ ] Test hamburger menu opens/closes properly in top-right corner

#### 2. Default Duration Configuration
- [ ] Adjust exercise duration slider (default: 45s)
- [ ] Adjust rest duration slider (default: 30s)
- [ ] Verify changes are reflected in new exercise forms

#### 3. Exercise Management
- [ ] Click "Add Exercise" button in Split 1
- [ ] Enter exercise name (e.g., "Push-ups")
- [ ] Select duration from dropdown (notice default values are highlighted)
- [ ] Toggle L/R checkbox to test left/right exercise functionality
- [ ] Click "Add" to create exercise
- [ ] Verify exercise appears in list with inline editing capability

#### 4. Inline Editing
- [ ] Click on exercise name to edit inline
- [ ] Change duration via dropdown
- [ ] Notice visual highlighting when using default duration values
- [ ] Test checkbox for L/R exercises
- [ ] Verify all changes save automatically

#### 5. Multiple Splits
- [ ] Scroll to bottom and create additional splits using "Add Split" form
- [ ] Set different numbers of sets for each split
- [ ] Add exercises to multiple splits
- [ ] Test deleting splits (exercises should be removed)

#### 6. Timer Functionality
- [ ] Add at least one exercise to a split
- [ ] Click "Start Workout" button
- [ ] Verify timer interface loads with circular progress indicator
- [ ] Check exercise name and type (Exercise/Rest) display correctly
- [ ] Test pause/resume functionality
- [ ] Verify total remaining time updates accurately
- [ ] Test "Back to Configuration" button

#### 7. Left/Right Exercise Flow
- [ ] Create an exercise with L/R checkbox enabled
- [ ] Start timer and verify flow: Exercise (Left) → Rest → Exercise (Right) → Rest
- [ ] Confirm timing is doubled for L/R exercises

#### 8. Sound Effects
- [ ] Interact with page first (click somewhere) to enable audio
- [ ] Start timer and listen for start sound
- [ ] Wait for transitions between exercises for transition sounds
- [ ] Complete a short workout for completion sound

#### 9. User Authentication
- [ ] Click hamburger menu in top-right
- [ ] Test "Sign In with Google" (requires real Google account)
- [ ] Verify user name appears after successful login
- [ ] Test sign out functionality

#### 10. Persistence Testing
- [ ] Configure exercises and splits
- [ ] Refresh the browser page
- [ ] Verify all configuration persists via localStorage
- [ ] Test that timer state resets but configuration remains

#### 11. Responsive Design
- [ ] Test on mobile device or resize browser window
- [ ] Verify layouts remain functional on small screens
- [ ] Check touch targets are appropriately sized
- [ ] Test menu behavior on mobile

#### 12. Error Handling
- [ ] Try to start workout with no exercises (should show warning)
- [ ] Test navigation during active timer
- [ ] Verify graceful handling of audio failures (check browser console)

### Expected Behavior Summary

- **Configuration**: Auto-initialization, real-time updates, visual indicators
- **Timer**: Smooth countdown, accurate progress display, proper audio cues
- **Navigation**: Seamless transitions, state preservation, responsive design
- **Persistence**: LocalStorage saves configurations between sessions
- **Authentication**: Google OAuth integration with profile display

### Build and Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase (requires Firebase CLI setup)
firebase deploy
```

### Source Control

```bash
# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote repository
git push origin main
```

## Technical Architecture

### State Management
- **timerConfigSlice**: Workout configuration with automatic IndexedDB persistence
- **timerSlice**: Timer countdown with complex queue management for splits/sets
- **samplesSlice**: Sample workout data for quick start
- **savedWorkoutsSlice**: Saved workout templates with IndexedDB storage
- **userSlice**: Authentication state management

### Data Persistence
- **IndexedDB Middleware**: Automatic state persistence for specified Redux actions
- **State Loaders**: Automatic state restoration on app initialization
- **WorkoutDB**: Custom IndexedDB wrapper with error handling and graceful degradation
- **Audio Profile Persistence**: User audio preferences saved and restored automatically

### Component Hierarchy
```
App
├── ConfigPanel (main configuration interface)
│   ├── Default duration controls
│   ├── Audio profile selector (with IndexedDB persistence)
│   ├── Split management
│   └── Exercise CRUD operations
├── Timer (workout execution interface)
│   ├── Circular progress display
│   ├── Exercise information
│   ├── Screen wake lock integration
│   └── Control buttons
├── WorkoutLibrary (saved workout management)
│   ├── Load/save workout templates
│   └── IndexedDB-backed storage
└── UserAuth (authentication component)
    ├── Google sign-in
    └── User profile display
```

### Key Technical Features
- **Automatic Persistence**: IndexedDB middleware saves state without manual intervention
- **Real-time State Updates**: All changes immediately reflected across components
- **Audio Management**: Web Audio API with profile system and countdown direction logic
- **PWA Capabilities**: Service worker, offline functionality, and screen wake lock
- **Type Safety**: Comprehensive TypeScript coverage with strict typing
- **Mobile Optimization**: CSS Grid/Flexbox with touch-friendly interactions
- **Error Boundaries**: Silent fallbacks for IndexedDB, localStorage, and audio failures
