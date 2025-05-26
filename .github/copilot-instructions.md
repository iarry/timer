## Priorities

- UX → maintainability → performance → security
- No fluff. Concise documentation only.
- ABSOLUTELY NO FLUFF. Avoid unnecessary words and phrases. Be concise and to
  the point.
- Use emojis in documentation titles to enhance readability and engagement.
- Avoid fluff in user-facing copy.
- Keep bundle size small.
- Do one TODO at a time, but you can read all of them to get context.
- Code should be self-documenting.
- Use comments only when necessary, and keep them concise.
- Don't use comments to preserve history.

## Code Quality

- When refactoring, the goal should generally be to reduce complexity and lines of code.
- DRY, KISS, YAGNI principles
- Deduplicate patterns into reusable components
- Follow CONTRIBUTING.md guidelines
- Split large files into logical components
- Separation of concerns
- Component hierarchy: atoms → molecules → organisms

## Workflow

- Keep dev server running (check port 5173 first)
- Update docs: README.md (user changes), CONTRIBUTING.md (dev changes)
- Clean up unused code/files/dependencies
- Mark completed TODOs in TODO.md
- Remove failed attempts before retrying.
- Do not create summary documents, just update DAG.md or CONTRIBUTING.md as needed (avoid fluff).

## Context & Memory

- README.md: project overview, features, roadmap
- CONTRIBUTING.md: style guides, best practices, commands
- DAG.md: architecture overview, project structure
