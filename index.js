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
  findById: (ctx, id) => users.find(id)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", (req, res, next) => {
  console.log(req.method + " :: " + req.get('host') + req.originalUrl)
  next()
})

app.use('*/assets/', express.static(path.resolve(__dirname, 'dist/assets')))

app.use(express.static(path.resolve(__dirname, 'dist/'), {
  setHeaders: res => {
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('X-Frame-Options', 'DENY')
  }
}))

app.get('/interaction/:uid', async (req, res, next) => {
  console.log('GET :: /:uid')

  try {
    const {
      uid, prompt, params, session,
    } = await oidc.interactionDetails(req)

    console.log(uid, prompt, params, session)

    const client = await oidc.Client.find(params.client_id)

    if (prompt.name.toLowerCase() === 'login')
      return res.sendFile(path.resolve('dist/index.html'))
    else
      return res.send('OKI DOKI')

  } catch (error) {
    return next(error)
  }
})

app.post('/interaction/:uid/login', (req, res, next) => {
  console.log('GET :: /:uid/login')
  // res.sendFile(path.resolve('dist/index.html'))
})

app.post('/interaction/:uid/confirm', async (req, res, next) => {
  console.log('GET :: /:uid/confirm')

  try {
    const { prompt: { name, details } } = await oidc.interactionDetails(req)

    console.log('GET :: /:uid/confirm')


    assert.equal(name, 'consent')

    await oidc.interactionFinished(req, res, {}, { mergeWithLastSubmission: true });

  } catch (error) {
    console.log('ERROR')
    next(error)
  }
})

app.get('/interaction/:uid/abort', (req, res, next) => {
  console.log('GET :: /:uid/abort')
  //res.sendFile(path.resolve('dist/index.html'))
})

app.use(oidc.callback)

app.listen(3000, console.log('Listening to port 3000'))




/*

oidc.initialize({ clients }).then( async () => {

  app.route('/interaction/:uid')
    .get( async (req, res) => {

      try {
        const {
          uid, prompt, params, session,
        } = await oidc.interactionDetails(req)

        const client = await oidc.Client.find(params.client_id)

        switch (promt.name) {
          case value:

            break;

          default:
            break;
        }

        console.log(uid, prompt, params, session)

      } catch (error) {
        console.log(error)
      }

      console.log('GET :: /:uid')
      res.sendFile(path.resolve('dist/index.html'))
    })
    .post((req, res) => {
      console.log('POST :: /:uid')
      res.send('POST :: /:uid')
    })

  app.post('/interaction/:uid/submit', (req, res) => {
    console.log(req.body)



    console.log('GET :: /:uid/submit')
    res.send('GET :: /:uid/submit')
  })

  app.use(oidc.callback)

  app.listen(3000, console.log('Listening to port 3000'))

  })

*/