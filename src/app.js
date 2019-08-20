require('dotenv').config()

const 
  express = require('express'),
  app = express(),
  path = require('path'),
  Provider = require('oidc-provider'),
  bodyParser = require('body-parser'),
  interaction = require('./routes/interaction'),
  { Terminal } = require("./utils/Terminal"),
  { ISSUER, SETUP } = require('./config/provider.config'),
  port = process.env.PORT || 3000

const oidc = new Provider(ISSUER, SETUP)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/", (req, res, next) => {
  res.oidc = oidc
  console.log(`${Terminal.BLUE}${req.method}${Terminal.RESET} :: ${req.get('host')}${req.originalUrl}`)
  next()
})

app.use(express.static(path.resolve(__dirname, '../dist/'), {
  setHeaders: res => {
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('X-Frame-Options', 'DENY')
  }
}))

app.use('/interaction', interaction)
app.use(oidc.callback)

app.listen(port, console.log(`👂 ${Terminal.MAGENTA} Listening to port ${port} ${Terminal.RESET}👂`))
