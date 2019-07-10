const router = require('express').Router()
const path = require('path')

router.get('/:uid', async (req, res) => {
  console.log('GET :: /:uid')
  res.sendFile(path.resolve('dist/index.html'))
})

router.post('/:uid', async (req, res) => {
  console.log('POST :: /:uid')
  res.send('POST :: /:uid')
})

router.post('/:uid/login', async (req, res) => {
  console.log('GET :: /:uid/login')
  res.send('GET :: /:uid/login')
})

router.post('/:uid/submit', async (req, res) => {

  console.log(req.body)

  console.log('GET :: /:uid/submit')
  res.send('GET :: /:uid/submit')
})

module.exports = router
