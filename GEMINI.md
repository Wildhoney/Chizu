# Structure

This document provides an overview of the `src/library` directory structure for the Chizu project, intended for AI assistants to understand the codebase.

## Core Concepts

The Chizu library is a state management library for React, seemingly inspired by Redux and other state management patterns. It uses a combination of hooks, actions, and a broadcast system for managing application state.

Key concepts include:

- **Model:** The application state, represented as a plain JavaScript object.
- **Actions:** Plain JavaScript objects that represent an intention to change the state. Actions can be local (unicast) or distributed (broadcast).
- **`useActions` hook:** The primary hook for connecting a component to the state and actions. It takes an initial model and an `ActionClass` as arguments. The hook returns a tuple containing the current state and a `dispatch` function. The `dispatch` function can be used to send actions to the state management system.
- **`useAction` hook:** A hook for defining action handlers. It takes a function as an argument, which will be executed when the corresponding action is dispatched. The handler function receives the current `context` (which includes the state and the `dispatch` function) and the `payload` of the action.
- **Immer:** Used for immutable state updates. This allows you to write code that appears to mutate the state directly, but actually creates a new, immutable version of the state.
- **Broadcast System:** A React context-based system for broadcasting actions to all components. This is used for distributed actions that need to be shared across different parts of the application.

## Coding Standards

- Use `type` instead of `interface`.
- Use `export function` instead of `export const () =>`.
- All comments and documentation must be written in British-English.

## Development Workflow

After each change, and when you think the task is complete, you must run `make checks`. This command will format, lint, typecheck, and run unit tests. If there are any issues, you must fix them.

Do not update the `CHANGELOG.md` file, as this is handled automatically during the release process.

If you make any changes to the library, ensure that the `README.md` file is updated to reflect these changes.

## Commit Message Format

The project follows the Conventional Commits specification. The commit messages should be in the following format:

```
<type>(<scope>): <description>
```

- **type**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `build`, `perf`, `style`, `revert`
- **scope** (optional): The scope of the change (e.g., `release`, `core`, `hooks`).
- **description**: A short, lowercase description of the change.

For example:

```
feat(hooks): add a new hook for something
fix(core): correct a bug in the main logic
docs: update the README file
```
