const emailvalidation = require("../helpers/emailValidation");
const emailcheck = require("../helpers/emailValidation");
const otpSend = require("../helpers/otpSend");
const sendEmail = require("../helpers/sendEmail");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
async function signupContoller(req, res) {
  let { username, email, password } = req.body;
  try {
    const otp = otpSend();
    if (!emailvalidation(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Not a Valid Mail" });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        console.log(err.message);
      }
      const addUser = new userModel({
        username,
        email,
        password: hash,
        otp,
      });
      
      await addUser.save();
      sendEmail(email, otp);
      
      
      setTimeout(async () => {
        await userModel.findOneAndUpdate({ email }, { $set: { otp: null } }).then(() => {
          console.log("OTP Deleted");
        });

        
      }, 3000000);
      return res
        .status(200)
        .json({
          success: true,
          message: "Account Created Successfully",
          data: addUser,
        });
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        sucess: false,
        message: error.message || "Something Went Wrong!",
      });
  }
}
async function loginContoller(req, res) {
  let { email, password } = req.body;
  try {
    const existUser = await userModel.findOne({ email });
    if (!existUser) {
      return res
        .status(400)
        .json({ sucess: false, message: "No Account Exist with your mail!" });
    } else {
      bcrypt.compare(
        password,
        existUser.password,
        async function (err, result) {
          if (!err) {
            if (result) {
              let userData = {
                id: existUser._id,
                username: existUser.username,
                role: existUser.role,
              };
              const token = jwt.sign({userData}, process.env.TOKEN_SECRET, { expiresIn: '1h' })
              res.cookie("token", token)
              return res
                .status(200)
                .json({
                  sucess: true,
                  message: "Login Successful",
                  data: userData,
                  token :token
                });
            } else {
              return res
                .status(400)
                .json({ sucess: false, message: "Password Wrong!" });
            }
          } else {
            return res
              .status(500)
              .json({ sucess: false, message: "Something went wrong!" });
          }
        }
      );
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        sucess: false,
        message: error.message || "Something Went Wrong!",
      });
  }
}
const otpVerifyController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    if (!user.otp) {
      return res.status(400).json({ success: false, message: "OTP expired or not set!" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }

    // ✅ OTP matched → clear it
    user.otp = null;
    user.isVerified = true; // optional
    await user.save();

    let userData = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    // ✅ create token
    const token = jwt.sign({ userData }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "OTP Verified successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// 📌 RESEND OTP Controller
const resendOtpController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found with this email!" });
    }

    // Generate new OTP
    const otp = otpSend();

    user.otp = otp;
    await user.save();

    // Send OTP again
    sendEmail(email, otp);

    // auto-clear OTP after 100 sec
    setTimeout(async () => {
      await userModel.findOneAndUpdate(
        { email },
        { $set: { otp: null } }
      );
      console.log("OTP Deleted after 5m");
    }, 3000000);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

async function logoutController(req,res){
    res.clearCookie('token')
    
    return res
                .status(200)
                .json({ success: true, message: "Logout Successfully" });

}

module.exports = { signupContoller, loginContoller, otpVerifyController, resendOtpController, logoutController };
