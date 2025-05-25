## Priorities

-   Priorize in this order: user experience, code maintainability, performance,
    and security.
-   ABSOLUTELY NO FLUFF. Avoid unnecessary words and phrases. Be concise and to the
    point. PARTICULARLY IMPORTANT FOR DOCUMENTATION. Emojis are allowed in titles.

## Code Quality

-   Always attempt to de-dupelicate code and business logic. If you find a
    pattern, create a reusable component.
-   Always follow the DRY (Don't Repeat Yourself) principle.
-   Always follow the KISS (Keep It Simple, Stupid) principle.
-   Always follow the YAGNI (You Aren't Gonna Need It) principle.
-   Always follow the CONTRIBUTING.md guidelines.
-   Split files into logical components. If a file is getting too large, split
    it into smaller files.
-   Follow the "Separation of Concerns" principle: separate your code into
    distinct sections, each with its own responsibility. This makes it easier to
    maintain and understand the code.
-   Component organization: atoms → molecules → organisms

## Workflow

-   Keep the dev server running to verify there's no compilation errors with
    your changes. Before starting it, check if it's already running by checking
    port 5173.
-   After making changes, update relevant documentation: README.md for user
    facing changes, and CONTRIBUTING.md for developer facing changes.
-   Always clean up after yourself. Look for unused code, files, classes, and
    dependencies related to things you've just changed.
-   After completeing a TODO, mark the TODO complete in TODO.md.

## Context & Memory

-   Reference README.md for: project overview, user instructions, features, and
    roadmap.
-   Reference CONTRIBUTING.md for: style guides, best practices, commands, and
    technical decisions.
-   Reference DAG.md for architecture overview and project structure.
