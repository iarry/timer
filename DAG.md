# Architecture (DAG.md)

React workout timer with Redux state management and IndexedDB persistence.

## Architecture

```
React Components ◄──► Redux Store ◄──► IndexedDB
```

## Redux Store

```
├── timerConfig: timing defaults, splits, audioProfile
├── timer: status, currentTime, queue, currentItem
└── savedWorkouts: workouts[], currentWorkoutId
```

## Components

```
App
├── OfflineIndicator
├── WorkoutSaveDialog
├── WorkoutLibrary
├── ConfigPanel (AudioProfileSelector, Split/Exercise CRUD with DnD)
└── Timer (Progress, Controls, Screen wake lock)
```

## Data Flow

- **Config**: User Input → Redux Actions → IndexedDB Middleware → State Update
- **Timer**: Start → Build queue → Countdown → Audio cues → Screen lock
- **Persistence**: Redux Action → Middleware → IndexedDB storage → State restore on startup

## Tech Stack

- **React 19.1.0** + **Redux Toolkit 2.8.2** + **TypeScript 5.8.3**
- **Vite 6.3.5** build tool
- **@dnd-kit** drag/drop, **Lucide React** icons
- **IndexedDB** persistence, **Web Audio API** sound

## Data Types

```typescript
interface Exercise {
    id: string; name: string; duration: number; leftRight?: boolean
}
interface Split {
    id: string; name: string; exercises: Exercise[]; sets: number
}
interface TimerItem {
    type: 'exercise' | 'rest'; name: string; duration: number
}
```

## Features

- **PWA**: Service worker, manifest, offline support
- **Screen Wake Lock**: Prevents sleep during workouts  
- **Audio System**: Web Audio API with multiple profiles
- **Local Storage**: IndexedDB with graceful degradation
