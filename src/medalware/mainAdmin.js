const jwt = require("jsonwebtoken")
const Admin = require("../models/admin")

const mainAdminAuth = async(req , res , next) => {
   try{
      const token = req.cookies.jwt
      const verifyAdmin = jwt.verify(token , "thisisFaizalhomoglobinlevelcareandcompanynameishbccareandthiswrbsitecreatedbysiddheshbhadale")
      console.log(verifyAdmin)
      
      const admin = await Admin.findOne({_id : verifyAdmin._id})
      
      req.token = token
      req.admin = admin
      console.log(admin.isAdmin)
      if(admin.isAdmin == "true"){
         next()
      }else{
         res.render("bookingData")
      }
   }catch(e){
      res.status(401).render("admi3n")
      console.log(e)
   }
}

module.exports = mainAdminAuth