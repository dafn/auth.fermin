const express = require('express'),
  app = express(),
  path = require('path'),
  Provider = require('oidc-provider')

const interaction = require('./routes/interaction')

const users = ['dafn.netcom@gmail.com']

const clients = [{
  client_id: 'test_implicit_app',
  grant_types: ['implicit'],
  response_types: ['id_token'],
  redirect_uris: ['https://testapp/signin-oidc'],
  token_endpoint_auth_method: 'none'
}];

const oidc = new Provider('http://localhost:3000', {
  claims: {
    email: ['email', 'email_verified'],
    profile: ['name']
  },
  findById: (ctx, id) => users.find(id)
})

app.use(express.static(path.resolve(__dirname, 'dist/'), {
  setHeaders: res => {
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('X-Frame-Options', 'DENY')
  }
}))

oidc.initialize({ clients }).then(function () {
  app.use('/interaction/', interaction)

  app.use(oidc.callback)
  app.listen(3000, console.log('Listening to port 3000'))
})
