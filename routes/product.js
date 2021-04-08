const mongoose = require('mongoose');

var productSchema =mongoose.Schema({
    title:{
        type:String,
        // required:true
    },
    Price:{
        type:Number,
        // required:true
    },
    color:{
        type:String,
        // required:true
    },
    Image:{
        type:String,
        // required:true
    },
    category:{
        type:String,
        // rerquired:true
    },
    size:{
        types:String,
        // required:true
    },
    des:{
        types:String
    }

})

module.exports =mongoose.model('Product',productSchema);