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

        
      }, 100000);
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
                isVerified: existUser.isVerified,
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
async function otpVerifyController(req, res) {
    let {email, otp} = req.body
    try {
      const userdata = await userModel.findOne({email}) 
      if(!userdata){
        return res
      .status(400)
      .json({
        sucess: false,
        message: "Email is not Exist!",
      });
      }
      if(otp == userdata.otp){
        let user = {
            username: userdata.username,
            email:userdata.email,
            role: userdata.role,
        }
        userdata.isVerified = true
        userdata.otp = null
        await userdata.save() 
        return res
                .status(200)
                .json({
                  sucess: true,
                  message: "OTP Verified",
                  data: user,
                });
      }else{
        return res
                .status(400)
                .json({ sucess: false, message: "OTP Mismatch!" });
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
async function logoutController(req,res){
    res.clearCookie('token')
    
    return res
                .status(200)
                .json({ success: true, message: "Logout Successfully" });

}

module.exports = { signupContoller, loginContoller, otpVerifyController, logoutController };
