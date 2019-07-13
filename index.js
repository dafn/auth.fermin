const express = require('express'),
  app = express(),
  path = require('path'),
  Provider = require('oidc-provider'),
  bodyParser = require('body-parser')

const { strict: assert } = require('assert');

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
  clients,
  findById: (ctx, id) => users.find(id),
  renderError: (ctx, {error, error_description}) => 
    ctx.res.redirect(`/Error?error=${error}&error_description=${error_description}`)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", (req, res, next) => {
  console.log(req.method + " :: " + req.get('host') + req.originalUrl)
  next()
})

app.use(express.static(path.resolve(__dirname, 'dist/'), {
  setHeaders: res => {
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('X-Frame-Options', 'DENY')
  }
}))

app.get('/interaction/:uid', async (req, res, next) => {
  try {
    const {
      uid, prompt, params, session,
    } = await oidc.interactionDetails(req)

    const a = await oidc.interactionDetails(req)

    console.log(a)

    const client = await oidc.Client.find(params.client_id)

    if (prompt.name.toLowerCase() === 'login')
      return res.sendFile(path.resolve('dist/Login/index.html'))
    else
      return res.sendFile(path.resolve('dist/Consent/index.html'))

  } catch (error) {
    return next(error)
  }
})

app.post('/interaction/:uid/login', (req, res, next) => {
  console.log('POST :: /:uid/login')
  // res.sendFile(path.resolve('dist/index.html'))
})

app.post('/interaction/:uid/confirm', async (req, res, next) => {
  console.log('GET :: /:uid/confirm')

  try {
    const { prompt: { name, details } } = await oidc.interactionDetails(req)

    assert.equal(name, 'consent')

    await oidc.interactionFinished(req, res, {}, { mergeWithLastSubmission: true });

  } catch (error) {
    return next(error)
  }
})

app.get('/interaction/:uid/abort', (req, res, next) => {
  console.log('GET :: /:uid/abort')
  //res.sendFile(path.resolve('dist/index.html'))
})

app.use((err, req, res, next) => {
  res.redirect(`/Error?error=${err.error}&error_description=${err.error_description}`)
  next(err)
});

app.use(oidc.callback)

app.listen(3000, console.log('Listening to port 3000'))
