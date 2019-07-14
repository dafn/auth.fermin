const router = require('express').Router()
const Account = require('../utils/Account')
const { strict: assert } = require('assert');
const path = require('path')

router.get('/:uid', async (req, res, next) => {
  console.log('POST :: /:uid')
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
  console.log('POST :: /:uid/login')
  try {
    const { uid, prompt, params } = await res.oidc.interactionDetails(req);
    const client = await res.oidc.Client.find(params.client_id);

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

    await res.oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
})
router.post('/:uid/confirm', async (req, res, next) => {
  console.log('GET :: /:uid/confirm')

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
  console.log('GET :: /:uid/abort')
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