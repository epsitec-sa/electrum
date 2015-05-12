# Electrum Bus

Components using Electrum might want to send messages and notifications onto
the **Electrum Bus**. The bus is just an asynchronous communication channel.
It might be implemented using Rx, Reflux, SignalR, or whatever is fit for the
underlying architecture.

## Principles

When the user interacts with the UI, she can produce two kind of events:

1. **Actions** which should trigger something.
2. **Changes** to the data.

## API

Access the Electrum Bus with `E.bus` (if `E` is a configured instance
of `Electrum`).

### Dispatching a message

* `E.bus.dispatch (obj, message)` &rarr; dispatch a message about a user action.

`obj` is the instance of the component and `message` the action which
should be triggered.

### Notifying a change

* `E.bus.notify (obj, value, ...states)` &rarr; notify about a change.

`obj` is the instance of the component, `value` the new value and `states`
can contain zero, one or multiple associated states (see [API](API.md)).
