const express = require('express');
const router = express.Router();
const passport =require('passport');
const userModel =require('./users');
const localStragedy =require('passport-local');
const productModel =require('./product');
const nodemailer = require('nodemailer');
const crypto =require("crypto");
const async =require("async");
require('./oauth2');
require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
// const Cart =require('./cart');

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
        res.render('otp',{phonenumber:req.query.phonenumber})
    }) 
 } else {
    res.status(400).send({
        message: "Wrong phone number :(",
        phonenumber: req.query.phonenumber,
    })
 }
})

router.get('/verify',function(req,res){
  // console.log(req.query.phonenumber);
  if (req.query.phonenumber && (req.query.code).length === 4) {
    client
        .verify
        .services(process.env.SERVICE_ID)
        .verificationChecks
        .create({
            to: `+91${req.query.phonenumber}`,
            code: req.query.code
        })
        .then(data => {
              if (data.status === "approved") {
              res.render('signup',{phonenumber:req.query.phonenumber})
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

router.get('/homepage', function(req, res){
  res.render('homePage');
});

router.get('/sign-up', function(req, res){
  res.render('signUp');
});

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
    gender:req.body.gender,
    address:req.body.address,
    pincode:req.body.pincode,
    city:req.body.city
  })
  userModel.register(newUser , req.body.password)
  .then(function(u){
  passport.authenticate('local')(req, res , function(){
    res.status(200).json({message: 'user registered', value:u})
  })
})
})

router.post('/login' , passport.authenticate('local' , {
  successRedirect:'/profile',
  failureRedirect:'/'
}), function(req , res , next){})

// ----------------------------forgetpassword------------------------------

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      // console.log(userModel.findOne({ email: req.body.email }));
      userModel.findOne({ email: req.body.email }, function(err, user) {
        console.log(user);
        if (!user) {
          // req.flash('error', 'No account with that email address exists.');
        
          return res.json({val:"no account with that email"});
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport( {
        service: 'gmail',
        auth: {
          user: 'tikarer123@gmail.com',
          pass: '8357087132'
        }
      });
      var mailOptions = {
        from: 'ritesh tikare',
        to: user.email,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.json({val:"mssage is send"});
  });
});

router.get('/reset/:token', function(req, res) {
  userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      // req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    // res.render('reset', {
    //   user: req.user
    // });
    res.json({val:"reset password"})
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          // req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'gmail',
        auth: {
          user: 'tikarer123@gmail.com',
          pass: '8357087132'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        // req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

router.get('/profile',function(req,res){
  userModel.findOne({username:req.user})
  .then(function(ritesh){
    res.status(200).json({val:ritesh})
  })
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
    Price: req.body.productPrice,
    color: req.body.productcolor,
    category: req.body.category,
    title:req.body.title,
    Image:req.body.Image,
    size:req.body.size,
    des:req.body.des
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

// router.get('/product/:page',function(req,res){
//   var perPage = 1;
//   var page = Math.max(0, req.params.page);
//   productModel.find()
//     .limit(perPage)
//     .skip(perPage * page)
//     .exec(function(err,cars) {
//         carModel.count().exec(function(err, count) {
//             res.render('product', {
//               products:product,
//                 page: page,
//                 pages: count / perPage
//             })
//         })
//     })
// })

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
router.get('/addcart',function(req,res){
  req.user.addToCart(req.body.id)
  .then(() => {
    res.redirect('/cart');
}).catch(err => console.log(err));
})

router.get('/cart',function(req,res){
  req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log(user);
            res.status(200).json( { cart: user.cart, pageTitle: 'Shopping Cart Detail' });
        })
        .catch(err => console.log(err));
})

router.post('/delete-cart',function(req,res){
  req.user.removeFromCart(req.body.prodId)
  .then(() => {
      res.redirect('/cart');
  }).catch(err => console.log(err));
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  else{
    res.status(200).json({msg:'success',page:'index'});
  }
}





// // -----------------------------------------Sign Up--------------------------------------------

// router.get('/sign-up', function(req, res){
//   res.render('signUp');
// });

// // -----------------------------------------Sign In--------------------------------------------

// router.get('/sign-in', function(req, res){
//   res.render('signIn');
// });


// // -----------------------------------------Log In With Password--------------------------------------------

// router.get('/log-in-with-password', function(req, res){
//   res.render('logInWithPassword');
// });


// // -----------------------------------------cart--------------------------------------------
// router.get('/bag', function(req, res){
//   res.render('Cart');
// });

// router.get('/add-address', function(req, res){
//   res.render('Address_Cart');
// });


// // -----------------------------------------User - Profile--------------------------------------------

// router.get('/user-profile', function(req, res){
//   res.render('Profile');
// });

// // -----------------------------------------edit - Profile--------------------------------------------

// router.get('/edit-profile', function(req, res){
//   res.render('edit_Profile');
// });

// // -----------------------------------------Orders - done--------------------------------------------

// router.get('/Orders', function(req, res){
//   res.render('Orders');
// });

// // -----------------------------------------Contact Us--------------------------------------------

// router.get('/contact-us', function(req, res){
//   res.render('ContactUs');
// });

// // -----------------------------------------Terms Of Use--------------------------------------------

// router.get('/terms-of-use', function(req, res){
//   res.render('termsOfUse');
// });

// // -----------------------------------------Privacy Policy--------------------------------------------

// router.get('/privacy-policy', function(req, res){
//   res.render('privacyPolicy');
// });

// // -----------------------------------------HomePage--------------------------------------------

// router.get('/homepage', function(req, res){
//   res.render('homePage');
// });

// // -----------------------------------------Products--------------------------------------------

// router.get('/products', function(req, res){
//   res.render('products');
// });

// // -----------------------------------------Products Inner Page--------------------------------------------

// router.get('/productInner', function(req, res){
//   res.render('productInner');
// });

// // -----------------------------------------wishlist Page--------------------------------------------

// router.get('/wishlist', function(req, res){
//   res.render('wishlist');
// });
module.exports = router;
