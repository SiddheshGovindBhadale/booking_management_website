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



// page redirection
app.get( "/" ,mainAdminAuth, async (req , res) =>{
  res.render("dashboard")
})

app.get( "/adminsloginL" , async (req , res) =>{
  res.render("admi3n")
})

app.get( "/addAdminL" , async (req , res) =>{
  res.render("addAdmin")
})

app.get( "/addServiceL" ,mainAdminAuth, async (req , res) =>{
  res.render("servicesForm")
})

app.get( "/bookingDataL" ,mainAdminAuth, async (req , res) =>{
  res.render("bookingData")
})

app.get( "/collectedDataL" ,mainAdminAuth, async (req , res) =>{
  res.render("collected")
})

app.get( "/completedDataL" ,mainAdminAuth, async (req , res) =>{
  res.render("completed")
})

/*
app.get( "/siddhesh2" , adminAuth , async (req , res) =>{
  res.render("test")
  console.log(req.cookies.jwt)
})

app.get( "/siddhesh3" , mainAdminAuth , async (req , res) =>{
  res.render("test")
  console.log(req.cookies.jwt)
})*/









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
        res.status(201).render("index")
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

app.get('/username', auth, async(req, res) => {
  try{
     res.send(req.user.name);
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
        res.status(201).render("index")
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
       return dbtoken.token !== req.token;
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
app.post("/admin" , async (req , res) => {
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
        res.status(201).render("addAdmin")
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
        res.status(201).render("dashboard")
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
    console.log(` from logout ${req.admin.name}`)
    
    req.admin.tokens = req.admin.tokens.filter((dbtoken) => {
       return dbtoken.token !== req.token;
    })
    
    res.clearCookie("jwt")
    console.log("logout success")
    await req.admin.save()
    res.render("admin")
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
     res.status(201).send(insertBooking)
     
    
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