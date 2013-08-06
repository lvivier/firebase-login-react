/**
 * Dependencies.
 */

var Emitter = require('emitter')
  , each = require('each')

/**
 * User for use with FirebaseSimpleLogin.
 */

module.exports = User

function User (auth, db) {
  if (!(this instanceof User)) return new User(auth, db)
  var self = this

  // instantiate new auth from supplied constructor
  if (2 === arguments.length) {
    this._auth = new auth(db, handler)
  }
  // hijack the callback
  else if (1 === arguments.length) {
    this._auth = auth
    this._keys = []
    var fn = auth.mLoginStateChange
    this.on('login', fn)
    this.on('logout', fn)
    auth.mLoginStateChange = handler
  }

  function handler (err, data) {
    clear()
    if (data) set(data)

    if (data)  self.emit('login', err, data)
    if (!data) self.emit('logout', err, data)
    if (err)   self.emit('error', err, data)
  }

  function set (data) {
    each(data, function (key, val) {
      self[key] = val
      self.keys.push(key)
      self.emit('change '+key, val)
      self.emit('change', key, val)
    })
  }

  function clear () {
    // zero out values
    each(self.keys, function (key) {
      delete(self[key])
      self.emit('change '+key, null)
      self.emit('change', key, null)
    })
    self.keys = []
  }
}

Emitter(User.prototype)

User.use = function (fn) {
  fn(this)
  return this
}

User.prototype.ref = function () {
  return this._auth
}

User.prototype.login = function (service) {
  return this.ref().login(service)
}

User.prototype.logout = function () {
  return this.ref().logout()
}
