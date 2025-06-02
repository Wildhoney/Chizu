<div align="center">
  <img src="/media/logo.png" width="475" />
</div>

Strongly typed React framework using generators and efficiently updated views alongside the publish-subscribe pattern.

## Contents

1. [Benefits](#benefits)
1. [Getting started](#getting-started)
1. [Handling errors](#handling-errors)
1. [Distributed actions](#distributed-actions)
1. [Module context](#module-context)

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
export default <Actions<Module>>function Actions(module) {
  return {
    [Action.Name](name) {
      return module.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
};
```

```tsx
export default function Profile(props: Props): React.ReactElement {
  return (
    <Scope<Module> using={{ model, actions, props }}>
      {(module) => (
        <>
          <p>Hey {module.model.name}</p>

          <button
            onClick={() => module.actions.dispatch([Action.Name, randomName()])}
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
export default <Actions<Module>>function Actions(module) {
  return {
    async *[Action.Name]() {
      yield module.actions.produce((draft) => {
        draft.name = null;
      });

      const name = await fetch(/* ... */);

      return module.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
};
```

```tsx
export default function Profile(props: Props): React.ReactElement {
  return (
    <Scope<Module> using={{ model, actions, props }}>
      {(module) => (
        <>
          <p>Hey {module.model.name}</p>

          <button onClick={() => module.actions.dispatch([Action.Name])}>
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
export default <Actions<Module>>function Actions(module) {
  return {
    async *[Action.Name]() {
      yield module.actions.produce((draft) => {
        draft.name = module.actions.annotate(null);
      });

      const name = await fetch(/* ... */);
      return module.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
};
```

```tsx
export default function ProfileView(props: Props): React.ReactElement {
  return (
    <Scope<Module> using={{ module, actions, props }}>
      {(module) => (
        <>
          <p>Hey {module.model.name}</p>

          {module.validate.name.pending() && <p>Switching profiles&hellip;</p>}

          <button
            disabled={module.validate.name.is(State.Op.Update)}
            onClick={() => module.actions.dispatch([Action.Name])}
          >
            Switch profile
          </button>
        </>
      )}
    </Tree>
  );
}
```

## Handling errors

Most errors are likely to occur in the actions because the views should be free of side effects. First and foremost it's recommended that errors be encoded into your corresponding module using a library such as [`neverthrow`[(https://github.com/supermacro/neverthrow)] &ndash; that way you can effectively identify which properties are fallible and render the DOM accordingly:

```tsx
export default <Actions<Module>>function Actions(module) {
  return {
    *[Action.Name]() {
      yield module.actions.produce((draft) => {
        draft.name = null;
      });

      const name = await fetch(/* ... */);

      return module.actions.produce((draft) => {
        draft.name = name ? Result.Just(name) : Result.Nothing();
      });
    },
  };
};
```

However in eventualities where an error has not been caught in an action then the `Lifecycle.Error` is the next best thing &ndash; use it to display a toast message and log it your chosen error log service.

Additionally when rendering an error may be thrown which prevents the DOM from updating as you'd expect &ndash; perhaps a side effect has delivered an unexpected data structure. In those cases again `Lifecycle.Error` is your friend. When such an error is thrown the component boundary will be switched to `Boundary.Error` which you detect using `module.boundary.is(Boundary.Error)` and switch to an alternative markup that _should_ render, within that you could display a button to attempt recovery &ndash; simply call an action again and update the meta to switch the boundary back to `Boundary.Default`:

```tsx
export default <Actions<Module>>function Actions(module) {
  return {
    *[Action.Recover]() {
      yield module.actions.produce((draft) => {
        draft.name = null;
      });

      const name = await fetch(/* ... */);

      return module.actions.produce((draft, meta) => {
        meta.boundary = Boundary.Default;
        draft.name = name;
      });
    },
  };
};
```

If the component again throws an error after attempting recovery, it will simply switch back to the `Boundary.Error` again.

## Distributed actions

Actions can communicate with other mounted actions using the `DistributedActions` approach. You can configure the enum and union type in the root of your application:

```ts
export enum DistributedAction {
  SignedOut = "distributed/signed-out",
}

export type DistributedActions = [DistributedAction.SignedOut];
```

Note that you must prefix the enum name with `distributed` for it to behave as a distributed event, otherwise it'll be considered a module event only. Once you have the distributed actions you simply need to augment the module actions union with the `DistributedActions` and use it as you do other actions:

```ts
export type Actions = DistributedActions | [Action.Task, string]; // etc...
```

## Module context

In the eventuality that you have a component but don't want associated actions, models, etc&hellip; but want to still fire actions either the closest module or a distributed action, you can use the `useScoped` hook:

```ts
const module = useScoped<Module>();

// ...

module.actions.dispatch([Action.Task, "My task that needs to be done."]);
```

Alternatively you can pass the current module as a prop to your components using the `Scoped` helper:

```ts
export type Props = {
  module: Scoped<Module>;
};
```
