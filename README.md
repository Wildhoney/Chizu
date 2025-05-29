<div align="center">
  <img src="/media/logo.png" width="475" />
</div>

Strongly typed React framework using generators and efficiently updated views alongside the publish-subscribe pattern.

## Contents

1. [Benefits](#benefits)
1. [Getting started](#getting-started)
1. [Handling errors](#handling-errors)

## Benefits

- Finely tuned and thoughtful event-driven architecture superset of [React](https://react.dev/).
- Super efficient with views only re-rendering when absolutely necessary.
- Built-in support for [optimistic updates](https://medium.com/@kyledeguzmanx/what-are-optimistic-updates-483662c3e171) within components.
- Mostly standard JavaScript without quirky rules and exceptions.
- Clear separation of concerns between business logic and markup.
- First-class support for skeleton loading using generators.
- Strongly typed throughout &ndash; styles, actions and views.
- Avoid vendor lock-in with framework agnostic libraries such as [Shoelace](https://shoelace.style/).
- Easily communicate between actions using distributed actions.
- State is mutated sequentially ([FIFO](<https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)>)) and deeply merged for queued mutations.

## Getting started

Actions are responsible for mutating the state of the view. In the below example the `name` is dispatched from the view to the actions, the state is updated and the view is rendered with the updated value.

```tsx
export default (function Actions(module) {
  return {
    [Events.Name](name) {
      return module.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
} as Actions<Module>);
```

```tsx
export default function Profile(props: Props): React.ReactElement {
  return (
    <Tree<Module> using={{ model, actions, props }}>
      {(module) => (
        <>
          <p>Hey {module.model.name}</p>

          <button
            onClick={() => module.actions.dispatch([Events.Name, randomName()])}
          >
            Switch profile
          </button>
        </>
      )}
    </Tree>
  );
}
```

You can perform asynchronous operations in the action which will cause the associated view to render a second time:

```tsx
export default (function Actions(module) {
  return {
    async *[Events.Name]() {
      yield module.actions.produce((draft) => {
        draft.name = null;
      });

      const name = await fetch(/* ... */);

      return module.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
} as Actions<Module>);
```

```tsx
export default function Profile(props: Props): React.ReactElement {
  return (
    <Tree<Module> using={{ model, actions, props }}>
      {(module) => (
        <>
          <p>Hey {module.model.name}</p>

          <button onClick={() => module.actions.dispatch([Events.Name])}>
            Switch profile
          </button>
        </>
      )}
    </Tree>
  );
}
```

However in the above example where the name is fetched asynchronously, there is no feedback to the user &ndash; we can improve that significantly by using the `module.actions.annotate` and `module.validate` helpers:

```tsx
export default (function Actions(module) {
  return {
    async *[Events.Name]() {
      yield module.actions.produce((draft) => {
        draft.name = module.actions.annotate(null);
      });

      const name = await fetch(/* ... */);
      return module.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
} as Actions<Module>);
```

```tsx
export default function ProfileView(props: Props): React.ReactElement {
  return (
    <Tree<Module> using={{ module, actions, props }}>
      {(module) => (
        <>
          <p>Hey {module.model.name}</p>

          {module.validate.name.pending() && <p>Switching profiles&hellip;</p>}

          <button
            disabled={module.validate.name.is(State.Op.Update)}
            onClick={() => module.actions.dispatch([Events.Name])}
          >
            Switch profile
          </button>
        </>
      )}
    </Tree>
  );
}
```

## Handling Errors

Actions can throw errors directly or in any of their associated `yield` actions &ndash; all unhandled errors are automatically caught and broadcast using the `Lifecycle.Error` action &ndash; you can render these [in a toast](https://github.com/fkhadra/react-toastify#readme) or similar UI.

You can also customise these errors a little further with your own error `enum` which describes the error type:

<kbd>Types</kbd>

```ts
export const enum Errors {
  UserValidation,
  IncorrectPassword,
}
```

```tsx
export default (function Actions(module) {
  return {
    *[Events.Name]() {
      yield module.actions.produce((draft) => {
        draft.name = null;
      });

      const name = await fetch(/* ... */);

      if (!name) throw new EventError(Errors.UserValidation);

      return module.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
}) as Actions<Module>;
```

However showing a toast message is not always relevant, you may want a more detailed error message such as a user not found message &ndash; although you could introduce another property for such errors in your model, you could mark the property as fallible by giving it a `Maybe` type because it then keeps everything nicely associated with the `name` property rather than creating another property:

```tsx
export default (function Actions(module) {
  return {
    async *[Events.Name]() {
      yield module.actions.produce((draft) => {
        draft.name = Maybe.of(null);
      });

      const name = await fetch(/* ... */);

      if (!name) {
        return module.actions.produce((draft) => {
          draft.name = Maybe.of(new EventError(Errors.UserValidation));
        });
      }

      return module.actions.produce((draft) => {
        draft.name = Maybe.of(name);
      });
    },
  };
} as Actions<Module>);
```
