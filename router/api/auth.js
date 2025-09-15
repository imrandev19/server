const express = require('express')
const {signupContoller, loginContoller, logoutController, otpVerifyController} = require('../../controllers/authController')
const router = express.Router()



http://localhost:3000/api/auth/signup
router.post('/signup', signupContoller)
http://localhost:3000/api/auth/login
router.post('/login', loginContoller)

router.post('/otp-verify', otpVerifyController)
router.post('/logout', logoutController)


module.exports = router