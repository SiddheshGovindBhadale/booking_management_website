require('dotenv').config()
const cors = require('cors');
const express = require("express")
const app = express()
const router = new express.Router();
const path = require("path")
const bcrypt = require("bcryptjs")
const multer = require("multer")
const cookieParser = require('cookie-parser')
const hbs = require("hbs")
const jwt = require("jsonwebtoken")

require("../src/db/conection.js");
const User = require("../src/models/users")
const Admin = require("../src/models/admin")
const Booking = require("../src/models/booking")
const Collected = require("../src/models/bloodCollected")
const Completed = require("../src/models/allComplete")
const Service = require("../src/models/services")
const auth = require("../src/medalware/auth")
const adminAuth = require("../src/medalware/adminAuth")
const mainAdminAuth = require("../src/medalware/mainAdmin")
const norAuth = require("../src/medalware/norAuth")


const port = process.env.PORT || 3000


const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
})
app.use('/product', express.static('upload/images'));




app.use(express.json())
app.use(express.urlencoded({
    extended:false
}))
app.use(cors({
  origin:"*"
}))

const public_path = path.join(__dirname , "../public")
const temp_path = path.join(__dirname , "../templates/views")
const partials_path = path.join(__dirname , "../templates/partials")

app.use(cookieParser())
app.use(express.static(public_path))
app.set("view engine" , "hbs")
app.set("views" , temp_path)
hbs.registerPartials(partials_path)

let check =""

// Admin page redirection
app.get( "/adminDashL" ,adminAuth, async (req , res) =>{
  res.render("forAdmin/dashboard" , {admin:req.admin})
})

app.get( "/adminsloginL" , async (req , res) =>{
  res.render("forAdmin/adminLogin")
})

app.get( "/addAdminL" , mainAdminAuth ,async (req , res) =>{
  res.render("forAdmin/addAdmin" ,{admin:req.admin})
})

app.get( "/addServiceL" ,mainAdminAuth, async (req , res) =>{
  res.render("forAdmin/servicesForm",{admin:req.admin})
})

app.get( "/bookingDataL" ,adminAuth, async (req , res) =>{
  res.render("forAdmin/bookingData",{admin:req.admin})
})

app.get( "/collectedDataL" ,adminAuth, async (req , res) =>{
  res.render("forAdmin/collected",{admin:req.admin})
})

app.get( "/completedDataL" ,adminAuth, async (req , res) =>{
  res.render("forAdmin/completed",{admin:req.admin})
})




// User page redirection
app.get( "/bookFormL" , auth, async (req , res) =>{
  let userShortName = req.user.name.split(' ').slice(0,1).join(' ')
  res.render("bookForm" , {
      user:req.user,
      shortName:userShortName
  })
})

app.get( "/" , async (req , res) =>{
  const token = req.cookies.jwt
  let check = token == undefined
  if(token == undefined){
     res.render("index" ,{
         check:check
     })
  }else{
     const verifyUser = jwt.verify(token , "thisisFaizalhomoglobinlevelcareandcompanynameishbccareandthiswrbsitecreatedbysiddheshbhadale")
     const user = await User.findOne({_id : verifyUser._id})
     let userShortName = user.name.split(' ').slice(0,1).join(' ')
     res.render("index" , {
          user:user,
          check:check,
          shortName:userShortName
     })
  }
})

app.get( "/userLoginL" , async (req , res) =>{
  res.render("register")
})

app.get( "/userDashL" , auth , async (req , res) =>{
  let userShortName = req.user.name.split(' ').slice(0,1).join(' ')
  res.render("userDash" , {
      user:req.user,
      shortName:userShortName
  })
})

app.get( "/userServicesL" , async (req , res) =>{
  const token = req.cookies.jwt
  let check = token == undefined
  if(token == undefined){
     res.render("services" ,{
         check:check
     })
  }else{
     const verifyUser = jwt.verify(token , "thisisFaizalhomoglobinlevelcareandcompanynameishbccareandthiswrbsitecreatedbysiddheshbhadale")
     const user = await User.findOne({_id : verifyUser._id})
     let userShortName = user.name.split(' ').slice(0,1).join(' ')
     res.render("services" , {
          check:check,
          shortName:userShortName
     })
  }
})











/********* User **********/
// User registeration
app.post("/users" , async (req , res) => {
  try{
     const password = req.body.password
     const cPassword = req.body.conPassword
     
     if(password === cPassword){
        const resisterUser = new User({
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            password : password,
            conPassword : cPassword
        })
        
        const token = await resisterUser.generateToken()
        
        res.cookie("jwt" , token , {
            expires : new Date(Date.now + 60000),
            httpOnly : true
        })
        
        const resisterd = await resisterUser.save()
        let userShortName = resisterUser.name.split(' ').slice(0,1).join(' ')
        res.status(201).render("index" ,{
            shortName:userShortName
        })
     }else{
        res.send("password are not matching")
     }
  }catch(e){
     console.log(e)
  }
})

// get users
app.get('/users', async(req, res) => {
  try{
     const getUser = await User.find({});
     res.send(getUser);
  }catch(e){
     res.status(400).send(e);
  }
})

app.get('/userData', auth, async(req, res) => {
  try{
     res.send(req.user);
  }catch(e){
     res.status(400).send(e);
  }
})


// user login
app.post("/login" , async (req , res) => {
  try{
     const email = req.body.email
     const password = req.body.password
     
     const userEmail = await User.findOne({email : email})
     const isMatch = await bcrypt.compare(password , userEmail.password)
     const token = await userEmail.generateToken()
     
     res.cookie("jwt" , token , {
         expires : new Date(Date.now + 60000),
         httpOnly : true
     })
     
     if(isMatch){
        let userShortName = userEmail.name.split(' ').slice(0,1).join(' ')
        res.status(201).render("index" ,{
            shortName:userShortName
        })
     }else{
        res.send("Invalid Login details")
     }
  }catch(e){
     console.log(e)
  }
})



// user logout
app.get( "/logout" , auth , async(req , res) =>{
  try{
    console.log(` from logout ${req.user.name}`)
    
    req.user.tokens = req.user.tokens.filter((dbtoken) => {
       return dbtoken.token === req.token;
    })
    
    res.clearCookie("jwt")
    console.log("logout success")
    await req.user.save()
    res.render("register")
  }catch(e){
    console.log(e)
  }
})





/********* Admin **********/
// Admin registeration
app.post("/admin" ,mainAdminAuth, async (req , res) => {
  try{
     const password = req.body.password
     const cPassword = req.body.conPassword
     
     if(password === cPassword){
        const resisterAdmin = new Admin({
            name : req.body.name,
            username : req.body.username,
            password : password,
            conPassword : cPassword,
            isAdmin : "false"
        })
        
        const token = await resisterAdmin.generateToken()
        
        res.cookie("jwt" , token , {
            expires : new Date(Date.now + 60000),
            httpOnly : true
        })
        
        const resisterd = await resisterAdmin.save()
        res.status(201).render("forAdmin/addAdmin" ,{admin:resisterAdmin})
     }else{
        res.send("password are not matching")
     }
  }catch(e){
     console.log(e)
  }
})


//patch method use for create admin method
app.patch('/admin/:id', async(req, res) => {
  try{
     const _id = req.params.id;
     const updateAdmin = await Admin.findByIdAndUpdate(_id,req.body,{
       new:true
     });
     res.send(updateAdmin);
  }catch(e){
     res.status(500).send(e);
  }
})




// admin login
app.post("/adminlogin" , async (req , res) => {
  try{
     const username = req.body.username
     const password = req.body.password
     
     const userName = await Admin.findOne({username : username})
     const isMatch = await bcrypt.compare(password , userName.password)
     const token = await userName.generateToken()
     
     res.cookie("jwt" , token , {
         expires : new Date(Date.now + 60000),
         httpOnly : true
     })
     
     if(isMatch){
        res.status(201).render("forAdmin/dashboard" , {admin:userName})
     }else{
        res.send("Invalid Login details")
     }
  }catch(e){
     console.log(e)
  }
})



// admin logout
app.get( "/adminlogout" , adminAuth , async(req , res) =>{
  try{
    
    req.admin.tokens = req.admin.tokens.filter((dbtoken) => {
       return dbtoken.token === req.token;
    })
    
    res.clearCookie("jwt")
    await req.admin.save()
    res.render("forAdmin/adminLogin")
  }catch(e){
    console.log(e)
  }
})

// get Admin
app.get('/admin', async(req, res) => {
  try{
     const getAdmin = await Admin.find({});
     res.send(getAdmin);
  }catch(e){
     res.status(400).send(e);
  }
})

// delete admin
app.delete('/admin/:id', async(req, res) => {
 try{
    const DeleteAdmin = await Admin.findByIdAndDelete(req.params.id);
    res.send(DeleteAdmin);
 }catch(e){
    res.status(500).send(e);
 }
})















/*********** Services ************/
// Post services 
app.post("/services" , async (req , res) => {
  try{
        const resisterService = new Service({
            name : req.body.name,
            preTest : req.body.preTest,
            dTime : req.body.dTime,
            price : req.body.price,
            bPrice : req.body.bPrice,
            type : req.body.type
        })
        const resiste = await resisterService.save()
        console.log(resisterService)
        res.status(201)
  }catch(e){
     console.log(e)
  }
})


// get Services
app.get('/services', async(req, res) => {
  try{
     const getService = await Service.find({});
     res.send(getService);
  }catch(e){
     res.status(400).send(e);
  }
})


// update services
app.patch('/services/:id', async(req, res) => {
  try{
     const _id = req.params.id;
     const updateServices = await Service.findByIdAndUpdate(_id,req.body,{
       new:true
     });
     res.send(updateServices);
  }catch(e){
     res.status(500).send(e);
  }
})

// delete Services
app.delete('/services/:id', async(req, res) => {
  try{
     const DeleteServices = await Service.findByIdAndDelete(req.params.id);
     res.send(DeleteServices);
  }catch(e){
     res.status(500).send(e);
  }
})











/********* Booking ***********/
let date = new Date();
let today = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear();
//booking post data method
app.post('/booking', auth , upload.single('image'), async(req, res ,next) => {
  try{
     const addBooking = new Booking({
       image:req.file,
       name: req.body.name,
       email:req.body.email,
       phone: req.body.phone,
       test: req.body.test,
       place: req.body.place,
       pincode: req.body.pincode,
       address: req.body.address,
       date: today,
       userID :  req.user._id,
       status : "pending"
     })
     const insertBooking =  await addBooking.save();
     res.status(201)
     
    
  }catch(e){
     res.status(400).send(e);
     console.log(e)
  }
})

// get booking
app.get('/booking', async(req, res) => {
  try{
     const getBooking = await Booking.find({});
     res.send(getBooking);
  }catch(e){
     res.status(400).send(e);
  }
})


//booking patch(update) data method
app.patch('/booking/:id', async(req, res) => {
  try{
     const _id = req.params.id;
     const updateBooking = await Booking.findByIdAndUpdate(_id,req.body,{
       new:true
     });
     res.send(updateBooking);
  }catch(e){
     res.status(500).send(e);
  }
})


// delete booking 
app.delete('/booking/:id', async(req, res) => {
  try{
     const DeleteBooking = await Booking.findByIdAndDelete(req.params.id);
     res.send(DeleteBooking);
  }catch(e){
     res.status(500).send(e);
  }
})





/******** Collected ***********/
//collected post data method
app.post('/collected', async(req, res ) => {
  try{
     const addCollect = new Collected({
       image:req.body.image,
       name: req.body.name,
       email:req.body.email,
       phone: req.body.phone,
       test: req.body.test,
       place: req.body.place,
       pincode: req.body.pincode,
       address: req.body.address,
       date: req.body.date,
       userID :  req.body.userID,
       status : req.body.status
     })
     const insertCollection =  await addCollect.save();
     res.status(201).send(insertCollection)
     
    
  }catch(e){
     res.status(400).send(e);
     console.log(e)
  }
})

// get collect
app.get('/collected', async(req, res) => {
  try{
     const getCollect = await Collected.find({});
     res.send(getCollect);
  }catch(e){
     res.status(400).send(e);
  }
})

//collected patch(update) data method
app.patch('/collected/:id', async(req, res) => {
  try{
     const _id = req.params.id;
     const updateCollect = await Collected.findByIdAndUpdate(_id,req.body,{
       new:true
     });
     res.send(updateCollect);
  }catch(e){
     res.status(500).send(e);
  }
})


// delete collect
app.delete('/collected/:id', async(req, res) => {
  try{
     const DeleteCollect = await Collected.findByIdAndDelete(req.params.id);
     res.send(DeleteCollect);
  }catch(e){
     res.status(500).send(e);
  }
})







/******** Completed ***********/
//collected post data method
app.post('/completed', async(req, res ) => {
  try{
     const addComplete = new Completed({
       image:req.body.image,
       name: req.body.name,
       email:req.body.email,
       phone: req.body.phone,
       test: req.body.test,
       place: req.body.place,
       pincode: req.body.pincode,
       address: req.body.address,
       date: req.body.date,
       userID :  req.body.userID,
       status : req.body.status
     })
     const insertComplete =  await addComplete.save();
     res.status(201).send(insertComplete)
     
    
  }catch(e){
     res.status(400).send(e);
     console.log(e)
  }
})

// get completed
app.get('/completed', async(req, res) => {
  try{
     const getCollect = await Completed.find({});
     res.send(getCollect);
  }catch(e){
     res.status(400).send(e);
  }
})







app.listen( port , (e) => {
  console.log(`server is running on port ${port}`)
})