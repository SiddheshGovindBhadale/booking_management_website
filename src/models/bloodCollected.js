const express = require('express');
const mongoose = require('mongoose');

const collectSchema = new mongoose.Schema({
  name:{
    type:String
  },
  email:{
    type:String
  },
  phone:{
    type:Number
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


const Collected = new mongoose.model("Collected" , collectSchema);

module.exports = Collected;