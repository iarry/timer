# Architecture Overview (DAG.md)

This document describes the application architecture and data flow for the Vibe
Timer workout application.

## Application Overview

The Vibe Timer is a React-based workout timer application built with Redux for
state management and IndexedDB for local data persistence. It supports complex
workout configurations with multiple splits, exercises, and customizable timing.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Application   │    │   Persistence   │
│     Layer       │    │     Layer       │    │     Layer       │
│                 │    │                 │    │                 │
│  React          │◄──►│  Redux Store    │◄──►│  IndexedDB      │
│  Components     │    │  + Middleware   │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Data Flow Architecture

### Redux Store Structure

```
store
├── timerConfig (timerConfigSlice)
│   ├── defaultExerciseDuration: number
│   ├── defaultRestDuration: number
│   ├── splits: Split[]
│   └── audioProfile: string
│
├── timer (timerSlice)
│   ├── status: 'idle' | 'running' | 'paused' | 'completed'
│   ├── currentTime: number
│   ├── totalTimeRemaining: number
│   ├── currentItem: TimerItem | null
│   ├── queue: TimerItem[]
│   ├── originalSplits?: Split[]
│   ├── originalDefaultRestDuration?: number
│   └── currentItemIndex: number
│
├── samples (samplesSlice)
│   ├── hasLoadedSample: boolean
│   └── sampleWorkout: Split | null
│
└── savedWorkouts (savedWorkoutsSlice)
    ├── workouts: SavedWorkout[]
    └── currentWorkoutId: string | null
```

### Component Hierarchy

```
App
├── OfflineIndicator
├── WorkoutSaveDialog
├── WorkoutLibrary
└── main content (conditional)
    ├── ConfigPanel (when activeView === 'config')
    │   ├── AudioProfileSelector
    │   ├── Duration controls
    │   ├── Split management
    │   └── Exercise CRUD operations (with DnD)
    └── Timer (when activeView === 'timer' or timer active)
        ├── Progress visualization
        ├── Exercise information
        ├── Control buttons
        └── Screen wake lock integration
```

## Data Flow Patterns

### 1. Workout Configuration Flow

```
User Input → ConfigPanel → Redux Actions → timerConfigSlice → IndexedDB Middleware
                                                                      ↓
User sees updates ← Component re-renders ← useAppSelector ← State changes
```

### 2. Timer Execution Flow

```
Start Workout → initializeTimer → Build queue from splits → Start countdown
                                                                   ↓
Timer tick → tickTimer → Update currentTime → Move to next item → Audio cues
                                    ↓
Screen lock → useScreenWakeLock → Keep screen awake during workout
```

### 3. Persistence Flow

```
Redux Action → indexedDBMiddleware → Check PERSIST_ACTIONS → Store in IndexedDB
                                                                      ↓
App startup → initializeAppState → Load from IndexedDB → Restore Redux state
```

## Key Architectural Patterns

### 1. Redux State Management

-   **Feature-based slices**: Each domain (timer, config, workouts) has its own
    slice
-   **Immutable updates**: Using Redux Toolkit's Immer integration
-   **Type safety**: Full TypeScript integration with typed hooks
-   **Middleware pattern**: Custom IndexedDB middleware for automatic
    persistence

### 2. Component Organization (Atomic Design)

```
src/components/
├── common/           # Atoms (Button, OfflineIndicator)
├── config/           # Molecules (ConfigPanel, AudioProfileSelector)
├── timer/            # Organisms (Timer)
└── workouts/         # Organisms (WorkoutLibrary, WorkoutSaveDialog)
```

### 3. Data Persistence Strategy

-   **Automatic persistence**: IndexedDB middleware auto-saves on specific
    actions
-   **Graceful degradation**: Silent failure when IndexedDB unavailable
-   **State restoration**: Automatic loading on app initialization
-   **Local-first storage**: All data stored locally on device

### 4. Audio System Architecture

```
AudioSystem Class
├── Web Audio API integration
├── Profile-based sound management
├── Mute state management
└── Context lifecycle management
```

## Technical Dependencies

### Core Dependencies

-   **React 19.1.0**: UI framework with concurrent features
-   **Redux Toolkit 2.8.2**: State management with RTK Query
-   **TypeScript 5.8.3**: Type safety and developer experience
-   **Vite 6.3.5**: Build tool and dev server

### Feature Dependencies

-   **@dnd-kit**: Drag and drop for exercise reordering
-   **Lucide React**: Icon library
-   **PWA Plugin**: Progressive Web App capabilities

## Data Models

### Core Types

```typescript
interface Exercise {
    id: string
    name: string
    duration: number
    leftRight?: boolean // Doubles exercise time with rest between sides
}

interface Split {
    id: string
    name: string
    exercises: Exercise[]
    sets: number
}

interface TimerItem {
    type: 'exercise' | 'rest'
    splitId: string
    exerciseId?: string
    name: string
    duration: number
    setIndex: number
    exerciseIndex: number
}

interface SavedWorkout {
    id: string
    name: string
    splits: Split[]
    defaultExerciseDuration: number
    defaultRestDuration: number
    createdAt: string
    updatedAt: string
}
```

## System Integrations

### IndexedDB Integration

-   **Automatic persistence**: Middleware monitors specific Redux actions
-   **Schema versioning**: Database version management for migrations
-   **Error handling**: Graceful degradation when storage unavailable
-   **Lazy initialization**: Database opens on first use

### Web APIs Integration

-   **Screen Wake Lock API**: Prevents screen sleep during workouts
-   **Web Audio API**: Generates audio cues for timer events
-   **Offline detection**: Network status monitoring
-   **PWA features**: Service worker and manifest integration

## Performance Considerations

### Optimization Strategies

1. **Smooth animations**: RequestAnimationFrame for timer display
2. **Efficient re-renders**: Selective useAppSelector subscriptions
3. **Memory management**: Cleanup of intervals and event listeners
4. **Lazy loading**: Audio context creation on user interaction

### State Normalization

-   **Flat structure**: Avoiding deeply nested state
-   **Computed values**: Derived state calculations in components
-   **Memoization**: Preventing unnecessary re-computations

## Security & Privacy

### Data Handling

-   **Local-first**: Core functionality works without network
-   **No data collection**: All data stays on device
-   **Privacy-focused**: No external analytics or tracking
-   **Client-side storage**: Workout data stays on device

## Future Architecture Considerations

### Scalability Paths

1. **Cloud sync**: Firebase Firestore integration for cross-device sync
2. **Offline-first**: Enhanced PWA capabilities with background sync
3. **Plugin system**: Extensible audio profiles and workout templates
4. **Performance monitoring**: Error tracking and usage analytics (opt-in)

### Potential Migrations

-   **State persistence**: Consider additional storage backends
-   **Audio system**: Explore Web Audio API alternatives for better browser
    support
-   **Styling**: Potential migration to CSS-in-JS or Tailwind CSS
-   **Build system**: Monitor Vite alternatives as ecosystem evolves
