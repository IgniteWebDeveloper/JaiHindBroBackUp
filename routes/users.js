const mongoose =require('mongoose');
mongoose.connect("mongodb://localhost/ecommerce",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,});
const plm =require('passport-local-mongoose');
const Product = require('./product');
const bcrypt =require("bcrypt-nodejs");


var userSchema = mongoose.Schema({
  userid:String,
  username:{
      type:String,
    },
  password:String,
  email:String,
  fullname:String,
  gender:String,
  address:{
    type:String,
    default:'Complete Your Profile'
    },
  pincode:{
    type:String,
    default:'Complete Your Profile'
    },
  city:{
    type:String,
    default:'Complete Your Profile'
    },
  state:{
    type:String,
    default:'Complete Your Profile'
    },
  
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
},
resetPasswordToken: String,
 resetPasswordExpires: Date
})


userSchema.methods.addToCart = async function(productId) {
    const product = await Product.findById(productId);
    if (product) {
        const cart = this.cart;
        const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product._id).trim());
        if (isExisting >= 0) {
            cart.items[isExisting].qty += 1;
        } else {
            cart.items.push({ productId: product._id, qty: 1 });
        }
        console.log(cart.totalPrice);
        if(!cart.totalPrice) {
            cart.totalPrice = 0;
        }
        cart.totalPrice+=product.Price;
        return this.save();
    }

};

userSchema.methods.removeFromCart = function(productId) {
    const cart = this.cart;
    const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim());
    if (isExisting >= 0) {
        cart.items.splice(isExisting, 1);
        return this.save();
    }
}

userSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;
  
    if (!user.isModified('password')) return next();
  
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err) return next(err);
  
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });

  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

userSchema.plugin(plm);

module.exports = mongoose.model('users',userSchema);
