const { Router } = require('Express')
const router = Router()

const User = require('../models/User')

//json webtoken
const jwt = require('jsonwebtoken')
const { verify } = require('crypto')

router.get('/', (req, res) => res.send('Hello World'))

router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const newUser = new User({
    email,
    password,
  })
  console.log(newUser)
  await newUser.save()
  const token = jwt.sign({ _id: newUser._id }, 'secretKey')
  res.json({ token })
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).send('the email does not exist')
  }
  if (user.password !== password) {
    return res.status(401).send('wrong password')
  }
  const token = jwt.sign({ _id: user._id }, 'secretKey')
  return res.status(200).json({ token })
})

router.get('/tasks', (req, res) => {
  res.json([
    {
      _id: 1,
      name: 'task',
      description: 'djl',
      date: '25',
    },
    {
      _id: 2,
      name: 'task 2',
      description: 'djl',
      date: '25',
    },
  ])
})

router.get('/private-tasks', verifyToken, (req, res) => {
  res.json([
    {
      _id: 1,
      name: 'task',
      description: 'djl',
      date: '25',
    },
    {
      _id: 2,
      name: 'task 2',
      description: 'djl',
      date: '25',
    },
  ])
})

router.get('/profile', verifyToken, (req, res) => {
  res.send(req.userId)
})
module.exports = router

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('non request')
  }
  const token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('non request')
  }

  const payload = jwt.verify(token, 'secretKey')
  console.log('hola')
  req.userId = payload._id
  next()
}
