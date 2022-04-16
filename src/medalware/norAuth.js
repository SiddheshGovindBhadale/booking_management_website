const jwt = require("jsonwebtoken")
const User = require("../models/users")

const norAuth = async(req , res , next) => {
   try{
      next()
      const token = req.cookies.jwt
      const verifyUser = jwt.verify(token , "thisisFaizalhomoglobinlevelcareandcompanynameishbccareandthiswrbsitecreatedbysiddheshbhadale")
      
      
      const user = await User.findOne({_id : verifyUser._id})
      console.log(user.name)
      
      req.token = token
      req.user = user
   }catch(e){
      res.status(401).render("register")
   }
}

module.exports = norAuth