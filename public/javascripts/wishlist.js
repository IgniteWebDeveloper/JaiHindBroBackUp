/* -------------------------------------------------------- Script for navigation bar profile dropDown-------------------------- */

var coloured = document.querySelector('#coloured');
var uncoloured = document.querySelector('#bookmark');
var line = document.querySelector('.line');
uncoloured.addEventListener('click',function(){
    coloured.style.display = 'initial';
})

var dropDown = document.querySelector('.dropDown')
var hidden = document.querySelector('.hidden')
var profilepallet = document.querySelector('#profilepallet')

function bdaImg(profilepallet){
  profilepallet.style.height = "250px";
  hidden.style.display = 'flex';
  line.style.width = '105%';
}

function normalImg(profilepallet){
   profilepallet.style.height = "0px";
  line.style.width = '0%';
  hidden.style.display = 'none';
}