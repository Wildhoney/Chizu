# Marea

> /maˈɾe.a/

<img src="/media/logo.png" />

Strongly typed web component library using generators and efficiently updated views alongside the publish-subscribe pattern.

## Contents

1. [Benefits](#benefits)
1. [Controllers](#controllers)
1. [Distributed Actions](#distributed-actions)

## Benefits

- Thoughtful event-driven architecture superset of [React](https://react.dev/).
- Super efficient with views only re-rendering when absolutely necessary.
- Mostly standard JavaScript without quirky rules and exceptions.
- Clear separation of concerns between business logic and markup.
- First-class support for skeleton loading using generators with [Immer](https://immerjs.github.io/immer/).
- Strongly throughout &ndash; routes, styles, controllers and views.
- Avoid vendor lock-in with framework agnostic libraries such as [Shoelace](https://shoelace.style/).
- Easily communicate between controllers using distributed actions.
- State is mutated sequentially ([FIFO](<https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)>)) and [deeply merged](#state-merging) for queued mutations.
<!-- - Ablility to transpile to self-contained web components. -->

## Controllers

Each controller can `yield` as many actions as they desire, during the first pass of the action all of the associated promises will be collated and resolved asynchronously, once all of the promises have resolved the controller action is invoked a second time, passing in the result of the tasks and finally updating the model and re-rendering the associated view.

It's important to note that controllers are instantiated once when its associated view is mounted to the DOM, that makes them predictable for doing tasks without resorting to memoization &mdash; such as `setInterval`.

Furthermore you should not destructure `self` because otherwse the `self.model` and `self.element` variables will not be updated between action invocations.

During the first pass the model isn't updated, but the view is re-rendered and mutations updated which allows for displaying a pending state between passes. Once the controller action has completed its second pass, the model is updated and the view is re-rendered a second time with the updated model.

```tsx
export default create.controller<Model, Actions, Routes>((self) => {
  return {
    *[Events.ChangeProfile]() {
      const name: string = yield self.actions.io<string>(() => "Maria");

      return self.actions.produce((draft) => {
        draft.name = name;
      });
    },
  };
});
```

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
