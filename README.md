# Marea

> /maˈɾe.a/

<img src="/media/logo.png" />

Strongly typed web component library using generators and efficiently updated views alongside the publish-subscribe pattern.

## Contents

1. [Benefits](#benefits)
1. [Getting started](#getting-started)

## Benefits

- Thoughtful event-driven architecture superset of [React](https://react.dev/).
- Super efficient with views only re-rendering when absolutely necessary.
- Built-in support for [optimistic updates](https://medium.com/@kyledeguzmanx/what-are-optimistic-updates-483662c3e171) within components.
- Mostly standard JavaScript without quirky rules and exceptions.
- Clear separation of concerns between business logic and markup.
- First-class support for skeleton loading using generators..
- Strongly typed throughout &ndash; styles, controllers and views.
- Avoid vendor lock-in with framework agnostic libraries such as [Shoelace](https://shoelace.style/).
- Easily communicate between controllers using distributed actions.
- State is mutated sequentially ([FIFO](<https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)>)) and [deeply merged](#state-merging) for queued mutations.

## Getting started

Controllers are responsible for mutating the state of the view. In the below example the `name` is dispatched from the view to the controller, the state is updated and the view is rendered once with the updated value.

<kbd>Controller</kbd>

```tsx
export default create.controller<Module>((self) => {
  return {
    *[Events.Name](name) {
      return self.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
});
```

<kbd>View</kbd>

```tsx
export default create.view<Module>((self) => {
  return (
    <>
      <p>Hey {self.model.name}</p>

      <button
        onClick={() => self.actions.dispatch([Events.Name, randomName()])}
      >
        Switch profile
      </button>
    </>
  );
});
```

Fetching the name from an external source using an `actions.io` causes the controller event (`Events.Name`) and associated view to be invoked twice &ndash; once with a record of mutations to display a pending state, and then again with the model once it's been mutated.

<kbd>Controller</kbd>

```tsx
export default create.controller<Module>((self) => {
  return {
    *[Events.Name]() {
      self.actions.io(async () => {
        const name = await fetch(/* ... */);

        return self.actions.produce((draft) => {
          draft.name = name;
        });
      });

      return self.actions.produce((draft) => {
        draft.name = null;
      });
    },
  };
});
```

<kbd>View</kbd>

```tsx
export default create.view<Module>((self) => {
  return (
    <>
      <p>Hey {self.model.name}</p>

      <button onClick={() => self.actions.dispatch([Events.Name])}>
        Switch profile
      </button>
    </>
  );
});
```

As the event is invoked twice, it's important they are idempotent &ndash; by encapsulating your side effects in `actions.io` the promises are resolved before invoking the event again with those resolved values.

In the above example the name is fetched asynchronously &ndash; however there is no feedback to the user, we can improve that by using the `self.actions.placeholder` and `self.validate` helpers:

<kbd>Controller</kbd>

```tsx
export default create.controller<Module>((self) => {
  return {
    *[Events.Name]() {
      self.actions.io(async () => {
        const name = await fetch(/* ... */);

        return self.actions.produce((draft) => {
          draft.name = name;
        });
      });

      return self.actions.produce((draft) => {
        draft.name = self.actions.pending(null, State.Updating);
      });
    },
  };
});
```

<kbd>View</kbd>

```tsx
export default create.view<Module>((self) => {
  return (
    <>
      <p>Hey {self.model.name}</p>

      {self.validate.name.is(State.Pending) && (
        <p>Switching profiles&hellip;</p>
      )}

      <button
        disabled={self.validate.name.is(State.Updating)}
        onClick={() => self.actions.dispatch([Events.Name])}
      >
        Switch profile
      </button>
    </>
  );
});
```
