// router.post('/addproduct',function(req,res){
//     console.log(req.body)
//     const prod = new productModel({
//       Price: req.body.productPrice,
//       color: req.body.productcolor,
//       category: req.body.category,
//       title:req.body.title,
//       Image:req.body.Image,
//       size:req.body.size,
//       des:req.body.des
//   });
//   prod.save()
//       .then(result => {
//           res.status(200).json({val:result});
//       }).catch(err => console.log(err));
  
//   })

//   router.get('/editproduct/:prodId',function(req,res){
//     productModel.findById(req.params.prodId)
//     .then(product => {
//         res.status(200).json({ products: product });
//     }).catch(err => console.log(err));
//   })

//   router.post('/updateproduct',(req,res)=>{
//     productModel.findByIdAndUpdate(req.body.id)
//         .then(oldproduct => {
//             // console.log(oldproduct);
//             oldproduct.productId= req.body.id,
//             oldproduct. productPrice= req.body.Price,
//             oldproduct.productcolor= req.body.color,
//             oldproduct.productImage= req.body.Image,
//             oldproduct.category= req.body.category
//             return oldproduct.save();
//         })
//     .then(result => {
//         res.redirect('/product');
//     })
//     .catch(err => console.log(err));
//   })
  
//   router.post('/deleteProduct',function(req,res){
//     productModel.findByIdAndRemove(req.body.id) //findAndModify
//           .then(result => {
//               res.redirect('/product');
//           })
//           .catch(err => console.log(err));
//   })
    