const express = require('express')
const router = express.Router()
const api = require("./api")
router.use('/api', api)
router.use((req,res)=>{
  return  res.status(400).json({success:false, message: "Route Not Found"})
})
module.exports = router