const jwt = require('jsonwebtoken');
function adminAccess(req, res, next){
const token =req.cookies?.token
try {
    if (!token) {
      return res.status(401).json({ message: "Please Login First" });
    }
    // verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
     req.user = decoded;
     if (req.user.userData.role !== "admin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }
     next(); 
} catch (error) {
    return res.status(401).json({ message: "Invalid token" });
}
}

module.exports = adminAccess