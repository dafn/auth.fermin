const express = require('express'),
  app = express(),
  path = require('path'),
  Provider = require('oidc-provider'),
  bodyParser = require('body-parser'),
  interaction = require('./src/routes/interaction'),
  Account = require("./src/utils/Account"),
  { Terminal } = require("./src/utils/Terminal")

const clients = [{
  client_id: 'test_implicit_app',
  grant_types: ['implicit'],
  response_types: ['id_token'],
  redirect_uris: ['https://www.fermin.no'],
  token_endpoint_auth_method: 'none'
}];

const oidc = new Provider('http://localhost:3000', {
  claims: {
    email: ['email', 'email_verified'],
    openid: ['sub']
  },
  clients,
  findAccount: Account.findById,
  renderError: (ctx, { error, error_description }) =>
    ctx.res.redirect(`/Error?error=${error}&error_description=${error_description}`),
  interactionUrl: ctx => `/interaction/${ctx.oidc.uid}`,
  features: {
    devInteractions: { enabled: false },
    encryption: { enabled: true },
    introspection: { enabled: true },
    revocation: { enabled: true },
  },
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/", (req, res, next) => {
  res.oidc = oidc
  console.log(`${Terminal.BLUE}${req.method}${Terminal.RESET} :: ${req.get('host')}${req.originalUrl}`)
  next()
})

app.use(express.static(path.resolve(__dirname, 'dist/'), {
  setHeaders: res => {
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('X-Frame-Options', 'DENY')
  }
}))

app.use('/interaction', interaction)

app.use((err, req, res, next) => {
  res.redirect(`/Error?error=${err.error}&error_description=${err.error_description}`)
  next(err)
});

app.use(oidc.callback)

app.listen(3000, console.log('Listening to port 3000'))
