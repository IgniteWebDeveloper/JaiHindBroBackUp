var btn1 = document.querySelector('#btn1');
var btn2 = document.querySelector('#btn2');
var signin = document.querySelector('.signin');
var signUp = document.querySelector('.signUp');
var bmtn1 = document.querySelector('#bmtn1');
var bmtn2 = document.querySelector('#bmtn2');
// var after = document.querySelector('#btn1::after');


btn1.addEventListener('click', function(){
    signin.style.display = 'flex';
    signUp.style.display = 'none';
    bmtn1.style.backgroundColor = 'orange';
    bmtn2.style.backgroundColor = 'transparent';
    btn2.style.color = 'rgb(160, 159, 159)';
    btn1.style.color = '#1C2A43';
    
   
})

btn2.addEventListener('click', function(){
    signin.style.display = 'none';
    signUp.style.display = 'flex'
    bmtn2.style.backgroundColor = 'orange';
    bmtn1.style.backgroundColor = 'transparent';
    btn1.style.color = 'rgb(160, 159, 159)';
    btn2.style.color = '#1C2A43';
})