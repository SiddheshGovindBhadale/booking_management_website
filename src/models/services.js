const express = require('express');
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name:{
    type:String
  },
  preTest:{
    type:String
  },
  dTime:{
    type:Number
  },
  price:{
    type:Number
  },
  bPrice:{
     type:Number
  },
  type:{
    type:String
  }
})


const Service = new mongoose.model("Service" ,serviceSchema );

module.exports = Service;