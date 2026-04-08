
let burger = document.getElementById('burger');


burger.addEventListener('click', () => {
window.history.back();
});


let cont = document.querySelector('.contant');
let cont_2 = document.querySelector('.contant_2');
let n_1 = document.querySelector('.nav_1');
let n_2 = document.querySelector('.nav_2');


cont.style.display = 'flex';
 n_1.style.color =' #e3a81f';
cont_2.style.display = 'none';

n_1.addEventListener('click', () => {
  cont.style.display = 'flex';
  cont_2.style.display = 'none';

  n_1.style.color =' #e3a81f';
  n_2.style.color ='#007bff';


});

n_2.addEventListener('click', () => {
  cont.style.display = 'none';
  cont_2.style.display = 'flex';
  n_2.style.color =' #e3a81f';
  n_1.style.color ='#007bff';
});

