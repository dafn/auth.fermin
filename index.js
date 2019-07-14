const express = require('express'),
  app = express(),
  path = require('path'),
  Provider = require('oidc-provider'),
  bodyParser = require('body-parser')

const { strict: assert } = require('assert');

const Account = require("./src/utils/Account")

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
    const { prompt, params } = await oidc.interactionDetails(req),
      client = await oidc.Client.find(params.client_id)

    return prompt.name.toLowerCase() === 'login'
      ? res.sendFile(path.resolve('dist/Login/index.html'))
      : res.sendFile(path.resolve('dist/Consent/index.html'))

  } catch (error) {
    return next(error)
  }
})

app.post('/interaction/:uid/login', async (req, res, next) => {
  console.log('POST :: /:uid/login')
  try {
    const { uid, prompt, params } = await oidc.interactionDetails(req);
    const client = await oidc.Client.find(params.client_id);

    const account = await Account.authenticate(req.body.email, req.body.password);

    if (!account) {
      res.send('invalid user')
      return;
    }

    const result = {
      login: {
        account: account.accountId,
      },
    };

    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
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

app.get('/interaction/:uid/abort', async (req, res, next) => {
  console.log('GET :: /:uid/abort')
  try {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };
    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
})

app.use((err, req, res, next) => {
  res.redirect(`/Error?error=${err.error}&error_description=${err.error_description}`)
  next(err)
});

app.use(oidc.callback)

app.listen(3000, console.log('Listening to port 3000'))
