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
  y.style.height = "110px";
  z.style.display = 'flex';
      a.style.display = 'flex';
      b.style.display = 'flex';
}

function normalrecommend(y) {
   y.style.height = "30px";
   z.style.display = 'none';
       a.style.display = 'none';
       b.style.display = 'none';
;}


var sort_by = document.querySelector('#sort_by');
var sort_byPanel = document.querySelector('#sort_byPanel');
var body = document.querySelector('body');

sort_by.addEventListener('click', function(){
  sort_byPanel.style.display = 'initial';
  body.style.position = 'fixed';
});

sort_byPanel.addEventListener('click',function(){
  sort_byPanel.style.display = 'none';
});


var mobFiltersBtn = document.querySelector('#Mob_filters');
var mobFilters = document.querySelector('#filters_Panel');
var closeBtn = document.querySelector('#close');
var applyBtn = document.querySelector('#apply');
var body = document.querySelector('body');

mobFiltersBtn.addEventListener('click', function(){
  mobFilters.style.display = 'initial';
  body.style.position = 'fixed';
});

closeBtn.addEventListener('click', function(){
  mobFilters.style.display = 'none';
  body.style.position = 'initial';
})

applyBtn.addEventListener('click', function(){
  mobFilters.style.display = 'none';
})




const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");

const optionsList = document.querySelectorAll(".option");

selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
});

optionsList.forEach(o => {
  o.addEventListener("click", () => {
    selected.innerHTML = o.querySelector("label").innerHTML;
    optionsContainer.classList.remove("active");
  });
});


var add_to_wish_border = document.querySelector('#add_to_wish_border');
var add_to_wish_fill = document.querySelector('.add_to_wish_fill');


// add_to_wish_border.addEventListener('click', function(){
//   add_to_wish_fill.style.display = 'initial';
//   add_to_wish_border.style.display = 'none';
// })


// document.querySelectorAll('.add_to_wish_border').forEach(item => {
//   item.addEventListener('click', event => {
//     add_to_wish_fill.style.display = 'initial';
//     add_to_wish_border.style.display = 'none';
//   })
// });

function saved(){
  // var add_to_wish_border = document.querySelector('#add_to_wish_border');
var add_to_wish_fill = document.querySelector('.add_to_wish_fill');
if(add_to_wish_fill.style.display === 'none'){
    add_to_wish_fill.style.display = 'initial'
}else{
  add_to_wish_fill.style.display === 'none'
}
}