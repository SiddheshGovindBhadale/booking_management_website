const jwt = require("jsonwebtoken")
const User = require("../models/users")

const norAuth = async(req , res , next) => {
   try{
      const token = req.cookies.jwt
      console.log("first")
      const verifyUser = jwt.verify(token , "thisisFaizalhomoglobinlevelcareandcompanynameishbccareandthiswrbsitecreatedbysiddheshbhadale")
      console.log("second")
      
      const user = await User.findOne({_id : verifyUser._id})
      req.token = token
      req.user = user
      console.log(req.user.name)
      next()
   }catch(e){
      res.status(401)//.render("register")
   }
}

module.exports = norAuth