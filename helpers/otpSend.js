const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");

function otpSend(){

    const generator1 = aleaRNGFactory(Date.now()).uInt32()
    
    const otp = generator1.toString().substring(0,6)
    return otp
}

module.exports = otpSend