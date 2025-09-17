const express = require('express')
const {signupContoller, loginContoller, resendOtpController, logoutController, otpVerifyController} = require('../../controllers/authController')
const router = express.Router()



http://localhost:5000/api/auth/signup
router.post('/signup', signupContoller)
http://localhost:5000/api/auth/login
router.post('/login', loginContoller)

router.post('/otp-verify', otpVerifyController)
router.post('/logout', logoutController)
router.post('/resend-otp', resendOtpController)


module.exports = router