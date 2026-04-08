import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth"

// Views & Components
import WillyHome from '../views/WelliCome.vue'
import willysecond from '../views/ServiceS.vue'
import About from '../views/AboutUss.vue'
import Connect from '../views/ConnectUss.vue'
import dec from '../views/DectionAry.vue'
import Video from '../views/VideoCall.vue'
import avatar from '../views/TexttoSign.vue'
import SomeVideo from '../views/SomeVideo.vue'
import SignUp from '../components/SignUp.vue'
import LogIn from '../components/LogIn.vue'

const routes = [
  { path: '/', name: 'LogIn', component: LogIn, meta: { hideNavbar: true } },
  { path: '/signup', name: 'SignUp', component: SignUp, meta: { hideNavbar: true } },

  { path: '/WillyHome', name: 'WelliCome', component: WillyHome, meta: { requiresAuth: true } },
  { path: '/ServiceS', name: 'willysecond', component: willysecond, meta: { requiresAuth: true } },
  { path: '/AboutUss', name: 'About', component: About, meta: { requiresAuth: true } },
  { path: '/ConnectUss', name: 'Connect', component: Connect, meta: { requiresAuth: true } },
  { path: '/DectionAry', name: 'dec', component: dec, meta: { requiresAuth: true } },
  { path: '/VideoCall', name: 'Video', component: Video, meta: { requiresAuth: true } },
  { path: '/TexttoSign', name: 'avatar', component: avatar, meta: { requiresAuth: true } },
  { path: '/SomeVideo', name: 'SomeVideo', component: SomeVideo, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const auth = getAuth()
function getCurrentUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => resolve(user))
  })
}

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser()
  const authPages = ['LogIn', 'SignUp']

  if (to.meta.requiresAuth && !user) {
    next({ name: 'LogIn' })
  } else if (user && authPages.includes(to.name)) {
    next({ name: 'WelliCome' })
  } else {
    next()
  }
})

export default router
