const mongoose = require('mongoose');
function dbConnection(){
     mongoose.connect(process.env.MONGO_DB_SERVER).then(()=>{
    console.log("Database Connected Successfully")
}).catch((err)=>console.log(err))
}

module.exports = dbConnection