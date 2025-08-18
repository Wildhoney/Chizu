# Structure

This document provides an overview of the `src/library` directory structure for the Chizu project, intended for AI assistants to understand the codebase.

## Core Concepts

The Chizu library is a state management library for React, seemingly inspired by Redux and other state management patterns. It uses a combination of hooks, actions, and a broadcast system for managing application state.

Key concepts include:

- **Model:** The application state, represented as a plain JavaScript object.
- **Actions:** Plain JavaScript objects that represent an intention to change the state. Actions can be local (unicast) or distributed (broadcast).
- **`useActions` hook:** The primary hook for connecting a component to the state and actions. It takes an initial model and an `ActionClass` as arguments.
- **`useAction` hook:** A hook for defining action handlers.
- **Immer:** Used for immutable state updates.
- **Broadcast System:** A React context-based system for broadcasting actions to all components.

## Coding Standards

- Use `type` instead of `interface`.
- Use `export function` instead of `export const () =>`.

## Directory Structure

### `src/library/action/`

- **`index.ts`**:
  - `createAction<T>(name?: string): Payload<T>`: Creates a new local action.
  - `createDistributedAction<T>(name?: string): Payload<T>`: Creates a new distributed action that can be shared across modules.
  - `isDistributedAction(action: Action): boolean`: Checks if an action is a distributed action.

### `src/library/annotate/`

- **`index.ts`**:
  - `Annotation<T>`: A class for annotating data with operations and a process.
  - `plain<M extends Model>(model: M): M`: A function to strip annotations from a model, returning a plain JavaScript object.

### `src/library/broadcast/`

- **`index.tsx`**:
  - `Broadcaster`: A React component that provides a broadcast context.
  - `useBroadcast()`: A hook to access the broadcast context.
- **`types.ts`**: Defines the types for the broadcast system.
- **`utils.ts`**: Utility functions for the broadcast system.
- **`utils.test.ts`**: Tests for the utility functions.

### `src/library/decorators/`

- **`index.ts`**:
  - `Synchronous`: A decorator.
  - `Debounce`: A decorator.

### `src/library/error/`

- **`index.tsx`**:
  - `ActionError`: A React component to handle errors in actions.
  - `useActionError()`: A hook to access the error context.
- **`types.ts`**: Defines the types for the error system.

### `src/library/hooks/`

- **`index.ts`**:
  - `useAction<M, AC, K>(handler)`: A hook to define an action handler.
  - `useActions<M, AC>(initialModel, ActionClass)`: The main hook for state management.
  - `useSnapshot<P>(props)`: A utility hook to get a stable snapshot of props.
- **`utils.ts`**: Utility functions for the hooks.

### `src/library/types/`

- **`index.ts`**: Defines the core types for the library, including `Model`, `Action`, `Context`, `Payload`, `Lifecycle`, etc.
- **`index.test.ts`**: Tests for the types.

### `src/library/utils/`

- **`index.ts`**:
  - `pk(id?: Pk<T>): boolean | symbol`: A function to generate a unique primary key or check if an ID is a valid primary key.
  - `set<M, A>(property: string)`: A higher-order function that returns a "setter" action.
- **`sleep/`**:
  - **`index.ts`**:
    - `sleep(ms: number): Promise<void>`: A function to pause execution for a specified amount of time.

## Development Workflow

After each change, and when you think the task is complete, you must run `make checks`. This command will format, lint, typecheck, and run unit tests. If there are any issues, you must fix them.

Do not update the `CHANGELOG.md` file, as this is handled automatically during the release process.

If you make any changes to the library, ensure that the `README.md` file is updated to reflect these changes.
