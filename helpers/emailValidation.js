const emailvalidation =(email)=>{
const emailcheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
return emailcheck
}
module.exports = emailvalidation