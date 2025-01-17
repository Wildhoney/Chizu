# Marea

> /maˈɾe.a/

<img src="/media/logo.png" />

Strongly typed web component library using generators and efficiently updated views alongside the publish-subscribe pattern.

## Contents

1. [Benefits](#benefits)
1. [View Helpers](#view-helpers)
1. [Distributed Actions](#distributed-actions)

## Benefits

- Thoughtful event-driven architecture superset of [Preact](https://github.com/preactjs/preact).
- Ablility to transpile to self-contained web components.
- Mostly standard JavaScript without quirky rules and exceptions.
- Clear separation of concerns between business logic and markup.
- First-class support for skeleton loading using generators with [Immer](https://immerjs.github.io/immer/).
- Strongly throughout &ndash; routes, styles, controllers and views.
- Avoid vendor lock-in with framework agnostic libraries such as [Shoelace](https://shoelace.style/).
- Easily communicate between controllers using distributed actions.
- State is mutated sequentially ([FIFO](<https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)>)) and [deeply merged](#state-merging) for queued mutations.

## Views

Use the `validate` function to introspect your model:

```tsx
<img
  src={model.avatar}
  alt="avatar"
  aria-busy={actions.validate((model) => modal.avatar === State.Pending)}
/>
```

You can also use the same approach for optimistic data:

```tsx
<h1>Hello {actions.validate((model) => model.avatar === State.Optimistic)}</h1>
```

## Distributed Actions

## State Merging

Imagine a scenario where there are three events dispatched in order of: `A` → `B` → `C`.

Each mutation updates a handful of properties, setting them to pending, optimistic, etc&hellip; However the async `io` requests are resolved in a different order: `B` → `C` → `A` but Marea cannot apply `B` or `C` because it's still awaiting the resolution of `A`. Once `A` is finally resolved the states are merged in the original dispatch order of `A` → `B` → `C` and the view is updated only once.

## Controller Passes

Relevant controller actions are invoked twice when dispatching an event, so it's important your updates are idempotent &ndash; by wrapping your actions in `actions.io` the supplied function will only be invoked on the first invocation, upon second invocation the aforementioned line will be resolved with its return value.

For example, take a typical and simple example of a controller update:

```tsx
*[Actions.UpdateName]() {
    const name = yield actions.io(() => "Adam");

    return actions.produce((draft) => {
        draft.name = name;
    });
}
```

On the first invocation the model will remain unchanged, but the state context will be updated so in your view you know which properties are pending, optimistic, etc... however on second invocation the model will be updated accordingly.
