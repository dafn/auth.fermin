const express = require('express'),
  app = express(),
  path = require('path'),
  Provider = require('oidc-provider'),
  bodyParser = require('body-parser')

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
  clients,
  findById: (ctx, id) => users.find(id)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.resolve(__dirname, 'dist/'), {
  setHeaders: res => {
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('X-Frame-Options', 'DENY')
  }
}))

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
