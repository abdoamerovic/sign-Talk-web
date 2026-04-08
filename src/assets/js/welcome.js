let burger = document.getElementById('burger')
let sideMenu = document.querySelector('.side_manu')

burger.addEventListener('click', function () {
  sideMenu.classList.toggle('active')
})
function setActiveLink() {
  let currentPage = window.location.pathname.split('/').pop()
  let headerLinks = document.querySelectorAll('.header nav a')
  let sideMenuLinks = document.querySelectorAll('.side_manu a')
  headerLinks.forEach((link) => link.classList.remove('active'))
  sideMenuLinks.forEach((link) => link.classList.remove('active'))

  if (window.innerWidth > 430) {
    headerLinks.forEach((link) => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active')
      }
    })
  } else {
    sideMenuLinks.forEach((link) => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active')
      }
    })
  }
}
document.addEventListener('DOMContentLoaded', setActiveLink)

window.addEventListener('resize', setActiveLink)
