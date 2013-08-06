# firebase-login-react

Use the [FirebaseSimpleLogin](https://www.firebase.com/docs/security/simple-login-overview.html) component of [Firebase](http://firebase.com/) with [reactive](https://github.com/component/reactive) templates. Goes together with [lvivier/firebase-react](https://github.com/lvivier/firebase-react).

### Wait, why?

Extensible, zero-effort user models with real events you can bind to, that's why.

## Example

```js
var auth = require('firebase-login-react')
  , reactive = require('reactive')

var el = document.getElementById('#user')
  , db = new Firebase('some.firebaseio.com/wherever')
  , user = auth(FirebaseSimpleLogin, db)

// use with reactive
reactive(el, user)

// bind to events: `login`, `logout`, `error`
user.on('login', fn)
```

## API

### auth(constructor, db)

Returns instance of `User` that can be used with reactive. `constructor` 
is the FirebaseSimpleLogin function and `db` is a Firebase reference.

Optionally, pass a FirebaseSimpleLogin instance. The existing callback from 
the instance will be preserved.

### auth.use(fn)

Plugin support: passes `User` constructor to `fn`. Chainable.

### User#ref()

Returns the FirebaseSimpleLogin instance.

### User#login(service)

Proxies `user.ref().login(service)`.

### User#logout()

Proxies `user.ref().logout()`.

### User#on(event, fn)

Calls `fn` when `event` fires. See Events.

### User#once(event, fn)

Calls `fn` when `event` fires, then unbinds `fn`. See Events.

### User#off(event[, fn])

Unbinds `fn` from `event`, or unbinds all functions bound to `event`. See Events.

## Events

- **login** fires after a successful call to `user.login()`
- **logout** fires after a call to `user.logout()`, and also when a login fails
- **error** fires when a login or logout attempt fails
- **change** fires for each property in the user object
- **change \<prop\>** ditto
