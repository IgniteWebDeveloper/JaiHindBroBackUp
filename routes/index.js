const express = require('express');
const router = express.Router();
const passport =require('passport');
const userModel =require('./users');
const localStragedy =require('passport-local');
const productModel =require('./product');
// const googleStrategy = require('passport-google-oauth20').Strategy;
// const user = require('./users');
require('./oauth2');
require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
const Cart =require('./cart');

passport.use(new localStragedy(userModel.authenticate()));

// oauth20 Authentication

// ------------------------------------------phonederification-----------------------------------

router.get('/phonelogin',function(req,res){
  console.log(req.query.phonenumber);
  if (req.query.phonenumber) {
    client
    .verify
    .services(process.env.SERVICE_ID)
    .verifications
    .create({
        to: `+91${req.query.phonenumber}`,
        channel: 'sms'
    })
    .then(data => {
        res.redirect('/otp-verify')
    }) 
 } else {
    res.status(400).send({
        message: "Wrong phone number :(",
        phonenumber: req.query.phonenumber,
    })
 }
})

router.get('/verify',function(req,res){
  if (req.query.phonenumber && (req.query.code).length === 4) {
    client
        .verify
        .services(process.env.SERVICE_ID)
        .verificationChecks
        .create({
            to: `+${req.query.phonenumber}`,
            code: req.query.code
        })
        .then(data => {
          console.log(data)
              if (data.status === "approved") {
              res.status(200).redirect('/');
                
            }
        })
} else {
    res.status(400).send({
        message: "Wrong phone number or code :(",
        phonenumber: req.query.phonenumber,
    })
}
})



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {mssg:"wellcome"});
});

router.get('/phone-number-page',function(req,res){
  res.render('phonenumberpage');
})

router.get('/otp-verify',function(req,res){
  res.render('otp');
})
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.query)
    res.redirect('/good');
  }
)

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
)

router.get('/good', (req, res) => res.send(`Welcome mr!${req.user.fullname}`))
router.get('/failed', (req, res) => res.send('You Failed to log in!'))

router.post('/reg' , function(req ,res){
  var newUser = new userModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email:req.body.email,
    gender:req.body.gender
  })
  userModel.register(newUser , req.body.password)
  .then(function(u){
  passport.authenticate('local')(req, res , function(){
    res.status(200).json({message: 'user registered' , value:u})
  })
})
})

router.post('/login' , passport.authenticate('local' , {
  successRedirect:'/profile',
  failureRedirect:'/'
}), function(req , res , next){})

router.get('/profile',function(req,res){
  res.status(200).json({mssg:'loggedIn'})
})

router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

router.get('/loginpage',function(req,res){
  res.render('login');
})


/* ------------------------------------------product------------------------------------------------*/

router.post('/addproduct',function(req,res){
  console.log(req.body)
  const prod = new productModel({
    productPrice: req.body.productPrice,
    productcolor: req.body.productcolor,
    category: req.body.category
});
prod.save()
    .then(result => {
        res.status(200).json({val:result});
    }).catch(err => console.log(err));

})

router.get('/product',function(req,res){
  // console.log(req.flash);
 productModel.find()
 .then(function(foundproduct){
   res.status(200).json({value:foundproduct})
 }).catch(err => console.log(err));
})

router.get('/productdetails/:prodId',function(req,res){
  productModel.findById(req.params.prodId)
        .then(product => {
            res.status(200).json({ prod: product});
        })
        .catch(err => console.log(err));
})

router.get('/editproduct/:prodId',function(req,res){
  productModel.findById(req.params.prodId)
  .then(product => {
      res.status(200).json({ products: product });
  }).catch(err => console.log(err));
})

router.post('/updateproduct',(req,res)=>{
  productModel.findByIdAndUpdate(req.body.id)
      .then(oldproduct => {
          // console.log(oldproduct);
          oldproduct.productId= req.body.id,
          oldproduct. productPrice= req.body.productPrice,
          oldproduct.productcolor= req.body.productcolor,
          oldproduct.productImage= req.body.productImage,
          oldproduct.category= req.body.category
          return oldproduct.save();
      })
  .then(result => {
      res.redirect('/product');
  })
  .catch(err => console.log(err));
})

router.post('/deleteProduct',function(req,res){
  productModel.findByIdAndRemove(req.body.id) //findAndModify
        .then(result => {
            res.redirect('/product');
        })
        .catch(err => console.log(err));
})

// -----------------------------------------cart--------------------------------------------




// GET: add a product to the shopping cart when "Add to cart" button is pressed
router.get("/add-to-cart/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    // get the correct cart, either from the db, session, or an empty cart.
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    if (
      (req.user && !user_cart && req.session.cart) ||
      (!req.user && req.session.cart)
    ) {
      cart = await new Cart(req.session.cart);
    } else if (!req.user || !user_cart) {
      cart = new Cart({});
    } else {
      cart = user_cart;
    }

    // add the product to the cart
    const product = await Product.findById(productId);
    const itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      // if product exists in the cart, update the quantity
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
      cart.totalQty++;
      cart.totalCost += product.price;
    } else {
      // if product does not exists in cart, find it in the db to retrieve its price and add new item
      cart.items.push({
        productId: productId,
        qty: 1,
        price: product.price,
        title: product.title,
        productCode: product.productCode,
      });
      cart.totalQty++;
      cart.totalCost += product.price;
    }

    // if the user is logged in, store the user's id and save cart to the db
    if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }
    req.session.cart = cart;
    req.flash("success", "Item added to the shopping cart");
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/product");
  }
})


// -----------------------------------------Sign Up--------------------------------------------

router.get('/sign-up', function(req, res){
  res.render('signUp');
});

// -----------------------------------------Sign In--------------------------------------------

router.get('/sign-in', function(req, res){
  res.render('signIn');
});


// -----------------------------------------Log In With Password--------------------------------------------

router.get('/log-in-with-password', function(req, res){
  res.render('logInWithPassword');
});


// -----------------------------------------cart--------------------------------------------
router.get('/cart', function(req, res){
  res.render('Cart');
});

router.get('/add-address', function(req, res){
  res.render('Address_Cart');
});


// -----------------------------------------User - Profile--------------------------------------------

router.get('/user-profile', function(req, res){
  res.render('Profile');
});

// -----------------------------------------edit - Profile--------------------------------------------

router.get('/edit-profile', function(req, res){
  res.render('edit_Profile');
});

// -----------------------------------------Orders - done--------------------------------------------

router.get('/Orders', function(req, res){
  res.render('Orders');
});

// -----------------------------------------Contact Us--------------------------------------------

router.get('/contact-us', function(req, res){
  res.render('ContactUs');
});

// -----------------------------------------Terms Of Use--------------------------------------------

router.get('/terms-of-use', function(req, res){
  res.render('termsOfUse');
});

// -----------------------------------------Privacy Policy--------------------------------------------

router.get('/privacy-policy', function(req, res){
  res.render('privacyPolicy');
});

// -----------------------------------------HomePage--------------------------------------------

router.get('/homepage', function(req, res){
  res.render('homePage');
});

// -----------------------------------------Products--------------------------------------------

router.get('/products', function(req, res){
  res.render('products');
});

// -----------------------------------------Products Inner Page--------------------------------------------

router.get('/productInner', function(req, res){
  res.render('productInner');
});

// -----------------------------------------wishlist Page--------------------------------------------

router.get('/wishlist', function(req, res){
  res.render('wishlist');
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  else{
    res.status(200).json({msg:'success',page:'index'});
  }
}

module.exports = router;
