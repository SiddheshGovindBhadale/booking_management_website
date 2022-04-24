const express = require('express');
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name:{
    type:String
  },
  email:{
    type:String
  },
  phone:{
    type:Number
  },
  slotStart:{
    type:String
  },
  slotEnd:{
    type:String
  },
  test:{
    type:String
  },
  place:{
    type:String
  },
  pincode:{
    type:Number
  },
  address:{
    type:String
  },
  date:{
    type: String
  },
  userID:{
    type: String
  },
  status : {
  
  },
  image:{
  
  }
})


const Booking = new mongoose.model("Booking" , bookingSchema);

module.exports = Booking;