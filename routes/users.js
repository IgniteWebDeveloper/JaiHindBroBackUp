const mongoose =require('mongoose');
mongoose.connect("mongodb://localhost/ecommerce",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,});
const plm =require('passport-local-mongoose');
const Product = require('./product');

var userSchema = mongoose.Schema({
  userid:String,
  usern:Number,
  password:String,
  email:String,
  fullname:String,
  gender:String,
  cart: {
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    }],
    totalPrice: Number
}
})



userSchema.plugin(plm);

module.exports = mongoose.model('users',userSchema);
