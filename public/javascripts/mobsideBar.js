var hamBurger = document.querySelector('#hamBurger');
var sidebar = document.querySelector('.sidebar');
var cross = document.querySelector('#close');
var backBtn = document.querySelector('#backBtn');
var search = document.querySelector('#search');
var searchbar = document.querySelector('.searchbar');
var sidebarshadow = document.querySelector('.sidebarshadow');
var mobNav = document.querySelector('#mobNav');

hamBurger.addEventListener('click',function(){
  sidebar.style.left = '0%';
  sidebar.style.display = 'flex';
  sidebarshadow.style.display = 'initial';
});
sidebarshadow.addEventListener('click',function(){
 sidebar.style.left = '-100%';
 sidebar.style.display = 'none';
 sidebarshadow.style.display = 'none';
});

cross.addEventListener('click',function(){
  sidebar.style.display = 'none';
  sidebarshadow.style.display = 'none';
  sidebar.style.left = '-100%';
});

search.addEventListener('click',function(){
  searchbar.style.display = 'flex';
  searchbar.style.right = '0';
  mobNav.style.display = 'none';
});

backBtn.addEventListener('click',function(){
  mobNav.style.display = 'flex';
  searchbar.style.display = 'none';
  searchbar.style.right = '-100%';
});