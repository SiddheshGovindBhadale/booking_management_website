const jwt = require("jsonwebtoken")
const Admin = require("../models/admin")

const adminAuth = async(req , res , next) => {
   try{
      const token = req.cookies.jwt
      const verifyAdmin = jwt.verify(token , "thisisFaizalhomoglobinlevelcareandcompanynameishbccareandthiswrbsitecreatedbysiddheshbhadale")
      console.log(verifyAdmin)
      
      const admin = await Admin.findOne({_id : verifyAdmin._id})
      console.log(admin)
      
      req.token = token
      req.admin = admin
      next()
   }catch(e){
      res.status(401).render("admin")
   }
}

module.exports = adminAuth