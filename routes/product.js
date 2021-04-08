const mongoose = require('mongoose');

var productSchema =mongoose.Schema({
    productPrice:{
        type:Number,
        required:true
    },
    productcolor:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        required:true
    },
    category:String
})

module.exports =mongoose.model('products',productSchema);