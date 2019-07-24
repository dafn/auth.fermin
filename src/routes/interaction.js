const router = require('express').Router()
const Account = require('../utils/Account')
const { strict: assert } = require('assert');
const path = require('path')

router.get('/:uid', async (req, res, next) => {
  try {
    const { prompt, params } = await res.oidc.interactionDetails(req),
      client = await res.oidc.Client.find(params.client_id)

    return prompt.name.toLowerCase() === 'login'
      ? res.sendFile(path.resolve('dist/Login/index.html'))
      : res.sendFile(path.resolve('dist/Consent/index.html'))

  } catch (error) {
    return next(error)
  }
})
router.post('/:uid/login', async (req, res, next) => {
  if (!(req.body.email.includes("@") && req.body.password.length >= 8 && req.body.password.length <= 18)) {
    res.sendStatus(406)
    return;
  }

  try {
    const { uid, prompt, params } = await res.oidc.interactionDetails(req),
      client = await res.oidc.Client.find(params.client_id),
      account = await Account.authenticate(req.body.email, req.body.password);

    if (!account) {
      res.sendStatus(406)
      return;
    }

    const result = { login: { account: account.accountId, }, };

    const redirectURL = await res.oidc.interactionResult(req, res, result);

    res.send(`{
      "redirectURL": "${redirectURL}"
    }`);
  } catch (err) {
    next(err);
  }
})
router.post('/:uid/confirm', async (req, res, next) => {
  try {
    const { prompt: { name, details } } = await res.oidc.interactionDetails(req)
    assert.equal(name, 'consent')
    await res.oidc.interactionFinished(req, res, { consent: {} }, { mergeWithLastSubmission: true });
  } catch (error) {
    console.log('confirm ERROR ::', error)
    return next(error)
  }
})
router.get('/:uid/abort', async (req, res, next) => {
  try {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };
    await res.oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
})
module.exports = router
