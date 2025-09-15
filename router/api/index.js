const express = require('express')
const router = express.Router()
const auth = require('./auth')
const category = require('./category')
const story = require('./story')

router.use('/auth', auth)
router.use('/category', category)
router.use('/story', story)



module.exports = router