# Timer

This is a HIIT timer that allows users to create custom workouts that support
the use case of multiple sets of different splits, largely based around the
recommended routine of r/calisthenics - where you do 3 sets of 2 exercises, 3
sets of 2 different exercises, 3 sets of another 2 exercises, and then 3 sets of
3 exercises, with varying times for each set or having one exercise include both
left and right sides.

## Initial Setup Details

🧠 Project Summary for Copilot

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
