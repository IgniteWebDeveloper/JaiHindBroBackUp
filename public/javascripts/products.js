function myFunction() {
    var x = document.querySelector('.children');
    if (x.style.display === 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
  }

  var z = document.querySelector('.text');
  var a = document.querySelector('.text1');
    var y = document.querySelector('.recommend');
  var b = document.querySelector('.text2');
  function bigrecommend(y) {
    y.style.height = "150px";
    z.style.display = 'flex';
        a.style.display = 'flex';
        b.style.display = 'flex';
  }
  
  function normalrecommend(y) {
     y.style.height = "40px";
     z.style.display = 'none';
         a.style.display = 'none';
         b.style.display = 'none';
  }
  


  var shop = document.querySelector('#shop');
  var back = document.querySelector('#back');
  var clothes = document.querySelector('.clothes');
  var return1 = document.querySelector('#arrowleft');
  var wish = document.querySelector('.wishdiv');
  var bookmark = document.querySelector('.mark');

  clothes.addEventListener('click',function(){
     back.style.display = 'none';
     shop.style.display = 'initial';
    
  })

  return1.addEventListener('click',function(){
    back.style.display = 'initial';
    shop.style.display = 'none';
   
 })

//  bookmark.addEventListener('click',function(){
//   wish.style.display = 'initial';
//   back.style.display = 'none';
//   back.style.left = '0';
// })


 var kuchbhi = document.querySelector('.kuchbhi')
 var hidden = document.querySelector('.hidden')
 var profilepallet = document.querySelector('#profilepallet')

function bdaImg(profilepallet) {
  profilepallet.style.height = "250px";
  // profilepallet.style.width = "200px";
  hidden.style.display = 'flex';
}

function normalImg(profilepallet) {
   profilepallet.style.height = "0px";
  profilepallet.style.width = "200px";
  hidden.style.display = 'none';
}





function mywish() {
  var coloredbook = document.querySelector('.coloredbook');
  var wishicon = document.querySelector('.wish');  
  if (coloredbook.style.display === 'none') {
    coloredbook.style.display = 'initial';
  } else {
    coloredbook.style.display = 'none';
  }
}


var recommend = document.querySelector('.recommend1')
var phonefilter = document.querySelector('.phonefilter')
var sortshadow = document.querySelector('.sortshadow');

document.querySelector('.first').addEventListener('click',function(){
  recommend.style.height = '300px';
  phonefilter.style.display = 'none';
  recommend.style.display = 'initial';
  sortshadow.style.display = 'initial';
})

document.querySelector('#closedfilter').addEventListener('click',function(){
  recommend.style.height = '0px';
  sortshadow.style.display = 'none';
  phonefilter.style.display = 'flex';
  recommend.style.display = 'none';
})

var bharat = document.querySelector('.bharat')
var phonefilter = document.querySelector('.phonefilter')
document.querySelector('.second').addEventListener('click',function(){
  bharat.style.height = '100%';
  // phonefilter.style.display = 'none';
  bharat.style.display = 'initial';
})

document.querySelector('.fir').addEventListener('click',function(){
  bharat.style.height = '0px';
  // phonefilter.style.display = 'flex';
  bharat.style.display = 'none';
})


document.querySelector('.point').addEventListener('click',function(){
  document.querySelector('.point').style.backgroundColor = 'rgb(70, 123, 238)';
  document.querySelector('#hover').style.color = '#fff';
  document.querySelector('#pointer').style.display = 'initial';
})
