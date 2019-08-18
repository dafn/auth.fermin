const Account = require("../utils/Account"),
  path = require('path'),
  { readFileSync } = require('fs'),
  errorPage = readFileSync(path.resolve('dist/Error/index.html'), 'utf8')

exports.ISSUER = "http://localhost:3000";
exports.SETUP = {
  claims: {
    email: ['email'],
    openid: ['sub']
  },
  clients: [{
    client_id: 'test_implicit_app',
    grant_types: ['implicit'],
    response_types: ['id_token'],
    redirect_uris: ['https://www.fermin.no'],
    token_endpoint_auth_method: 'none'
  }],
  findAccount: Account.findById,
  renderError: (ctx, { error, error_description }) => {
    ctx.type = 'html'
    ctx.body = errorPage
  },
  interactionUrl: ctx => `/interaction/${ctx.oidc.uid}`,
  features: {
    devInteractions: { enabled: false },
    encryption: { enabled: true },
    introspection: { enabled: true },
    revocation: { enabled: true },
  },
  cookies: {
    keys: ["hi", "there"],
    long: {
      httpOnly: true,
      maxAge: 1209600000,
      overwrite: true,
      sameSite: 'none',
      signed: true
    },
    short: {
      httpOnly: true,
      maxAge: 600000,
      overwrite: true,
      sameSite: 'lax',
      signed: true
    }
  }
};
