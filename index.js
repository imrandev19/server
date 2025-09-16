const express = require('express')
const router = require('./router')
const dbConnection = require('./config/db')
const cookieParser = require('cookie-parser');
const cors = require("cors");
require('dotenv').config() 
const app = express()
app.use(cookieParser());  
app.use(express.json()) 
app.use(express.static("uploads"))

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
app.use(router)
const PORT = process.env.PORT

dbConnection()
app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})