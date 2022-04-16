const express = require('express');
const mongoose = require('mongoose');

const completeSchema = new mongoose.Schema({
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


const Completed = new mongoose.model("Completed" , completeSchema);

module.exports = Completed;