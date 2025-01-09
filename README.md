# Marea

> /maˈɾe.a/

<img src="/media/logo.png" />

Strongly typed web component library using generators and efficiently updated views.

## Contents

1. [Benefits](#benefits)
1. [View Helpers](#view-helpers)
1. [Distributed Actions](#distributed-actions)

## Benefits

- Cleverly architected superset of [Preact](https://github.com/preactjs/preact).
- Ablility to transpile to self-contained web components.
- Mostly standard JavaScript without quirky rules and exceptions.
- Clear separation of concerns between business logic and markup.
- First-class support for skeleton loading using generators with [Immer](https://immerjs.github.io/immer/).
- Strongly typed routes, styles and controller event-driven architecture.
- Avoid vendor lock-in with framework agnostic libraries such as [Shoelace](https://shoelace.style/).
- Easily communicate between controllers using distributed actions.
- State is mutated sequentially ([FIFO](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics))) and [deeply merged](#state-merging) for queued mutations.

## View Helpers

Use the following helpers to construct your views where `prop` is any property in your model:

- `prop.pending()` yields `true` if the property is pending.
- `prop.otherwise("-")` provide a fallback value for when the property is pending.
- `prop.equals(State.Pending | State.Optimistic)` determines if the property is in a given state.

For skeleton elements you should use the `pending()` helper as part of the `aria-busy` attribute:

```tsx
<img src={model.avatar} alt="avatar" aria-busy={model.avatar.pending()} />
```

## Distributed Actions

## State Merging

Imagine a scenario where there are three events dispatched in order of: `A` → `B` → `C`. Each mutation updates a handful of properties, setting them to pending, optimistic, etc&hellip; However the async `io` requests are resolved in a different order: `B` → `C` → `A` but Marea cannot apply `B` or `C` because it's still awaiting the resolution of `A`. Once `A` is finally resolved the states are merged in the original dispatch order of `A` → `B` → `C` and the view is updated only once.
