const express = require('express')
const router = express.Router()
const auth = require('./auth')
const category = require('./category')
const story = require('./story')
const course = require('./course')

router.use('/auth', auth)
router.use('/category', category)
router.use('/courses', course)
router.use('/story', story)



module.exports = router