const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Must be input'],
        unique: [true, 'Must be Unique User Name'],
    },
    email:{
        type:String,
        required:[true, 'Must be input'],
        unique: [true, 'Email Already Exist'],
    },
    password:{
        type:String,
        minlength:[6, "Minimum 6 Characters"],
        required:[true, 'Must be input'],
    },
    address:{
       type:String, 
    },
    phone:{
        type:Number,
        minlength:[11, "Minimum 11 Characters"],
    },
    role:{
        type:String,
        enum:['student', 'admin'],
        default: 'student'
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    otp:{
        type:String
    }
},
{timestamps:true})

module.exports = mongoose.model('User', userSchema)