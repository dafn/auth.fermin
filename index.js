const express = require('express'),
  app = express(),
  path = require('path'),
  Provider = require('oidc-provider'),
  bodyParser = require('body-parser'),
  interaction = require('./src/routes/interaction'),
  Account = require("./src/utils/Account"),
  { Terminal } = require("./src/utils/Terminal"),
  { ISSUER, SETUP } = require('./src/config/provider.config')

const oidc = new Provider(ISSUER, SETUP)

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

app.listen(3000, console.log(`👂 ${Terminal.MAGENTA} Listening to port 3000 ${Terminal.RESET}👂`))
