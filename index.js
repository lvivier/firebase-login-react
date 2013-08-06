/**
 * Multi-provider user model
 */

var Emitter = require('emitter')
  , each = require('each')

module.exports = User

function User (auth, db) {
  if (!(this instanceof User)) return new User(auth)
  var self = this

  // instantiate new auth from supplied constructor
  if (2 === arguments.length) {
    this._auth = new auth(db, handler)
  }
  // hijack the callback
  else if (1 === arguments.length) {
    this._auth = auth
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
      self.emit('change '+key, val)
      self.emit('change', key, val)
    })
  }

  function clear () {
    // zero out values
    each(self, function (key) {
      // don't clear "hidden" props
      if (key.charAt(0) == '_') return
      delete(self[key])
      self.emit('change '+key, null)
      self.emit('change', key, null)
    })
  }

  // listen to provider to advertise avatar change
  this.on('logout', emitAvatar)
  this.on('login', emitAvatar)
  function emitAvatar () {
    self.emit('change avatar', self.avatar())
    self.emit('change', 'avatar', self.avatar())
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

User.prototype.avatar = function () {
  // TODO: gravatar from email for Persona and password
  return (this.provider == 'facebook') ?
    ('http://graph.facebook.com/'+this.id+'/picture') :
    this.profile_image_url ||
    this.avatar_url
}
