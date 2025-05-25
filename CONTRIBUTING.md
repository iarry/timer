# Contributing

## Commands

- `npm run dev` - Start dev server (port 5173)
- `npm run build` - TypeScript compile + Vite build
- `npm run lint` - ESLint check
- `npm run preview` - Preview built app

## Project Structure

```
src/
├── components/           # Atomic design (atoms → molecules → organisms)
│   ├── common/          # Button, OfflineIndicator
│   ├── config/          # ConfigPanel, AudioProfileSelector  
│   ├── timer/           # Timer
│   └── workouts/        # WorkoutLibrary, WorkoutSaveDialog
├── features/            # Redux slices by domain
│   ├── timer/           # Timer state management
│   ├── timerConfig/     # Configuration state
│   ├── samples/         # Sample workout loading
│   └── savedWorkouts/   # Workout persistence
├── hooks/               # Custom hooks (screen wake lock, sound effects)
├── middleware/          # IndexedDB persistence middleware
└── utils/               # Audio system, state loaders, utilities
```

## Architecture Overview

- **State**: Redux Toolkit with feature-based slices
- **Persistence**: IndexedDB via custom middleware
- **Components**: React 19 with TypeScript
- **Styling**: CSS custom properties with BEM-like naming
- **DnD**: @dnd-kit for exercise reordering
- **Audio**: Web Audio API with profile system

## Technical Decisions

- **TypeScript strict mode** - Full type safety with strict linting
- **Redux over Context** - Complex state with time-travel debugging needs
- **IndexedDB over localStorage** - Large workout data storage
- **Web Audio API** - Precise timing and multiple audio profiles
- **CSS custom properties** - Theme consistency without runtime overhead
- **Atomic design** - Scalable component organization
- **Feature slices** - Domain-driven Redux organization

## Best Practices & Style

### React

- **Functional components** with hooks only
- **Custom hooks** for reusable logic (useScreenWakeLock, useSoundEffects)
- **Props interfaces** with explicit types, no `any`
- **Event handlers** prefixed with `handle` (handleStartWorkout)
- **Controlled inputs** with Redux state backing
- **Cleanup** in useEffect return functions

### Redux

- **RTK patterns** - createSlice, PayloadAction types
- **Feature-based slices** - domain organization over technical
- **Typed hooks** - useAppSelector, useAppDispatch
- **Action naming** - past tense (addExercise, updateSplit)  
- **Middleware** for side effects (IndexedDB persistence)
- **Immutable updates** via Immer (built into RTK)

### CSS

- **CSS custom properties** for theming (--color-primary, --spacing-md)
- **BEM-like naming** (.exercise-item, .timer-controls)
- **Mobile-first** responsive design
- **Logical properties** where supported (margin-inline-start)
- **Component co-location** (.css files alongside .tsx)
- **Utility classes** for common spacing (mt-1, mb-2)
- **Specificity** be cautious adding specificity, avoid !important
