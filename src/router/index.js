import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'

// Views & Components
import WillyHome from '../views/WelliCome.vue'
import WillySecond from '../views/ServiceS.vue'
import About from '../views/AboutUss.vue'
import Connect from '../views/ConnectUss.vue'
import Dec from '../views/DectionAry.vue'
import Video from '../views/VideoCall.vue'
import Avatar from '../views/TexttoSign.vue'
import SomeVideo from '../views/SomeVideo.vue'
import SignUp from '../components/SignUp.vue'
import LogIn from '../components/LogIn.vue'
import AIChat from '../views/AIChat.vue'

const routes = [
  { path: '/', name: 'LogIn', component: LogIn, meta: { hideNavbar: true } },
  { path: '/signup', name: 'SignUp', component: SignUp, meta: { hideNavbar: true } },

  { path: '/WillyHome', name: 'WelliCome', component: WillyHome, meta: { requiresAuth: true } },
  { path: '/ServiceS', name: 'WillySecond', component: WillySecond, meta: { requiresAuth: true } },
  { path: '/AboutUss', name: 'About', component: About, meta: { requiresAuth: true } },
  { path: '/ConnectUss', name: 'Connect', component: Connect, meta: { requiresAuth: true } },
  { path: '/DectionAry', name: 'Dec', component: Dec, meta: { requiresAuth: true } },
  { path: '/VideoCall', name: 'Video', component: Video, meta: { requiresAuth: true } },
  { path: '/TexttoSign', name: 'Avatar', component: Avatar, meta: { requiresAuth: true } },
  { path: '/SomeVideo', name: 'SomeVideo', component: SomeVideo, meta: { requiresAuth: true } },
  { path: '/AIChat', name: 'AIChat', component: AIChat, meta: { requiresAuth: true } },

  // 404 fallback
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* 🔥 AUTH GUARD */
router.beforeEach(async (to) => {
  const user = await new Promise((resolve) => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })

  const authPages = ['LogIn', 'SignUp']

  // 🔴 not logged in → block protected pages
  if (to.meta.requiresAuth && !user) {
    return { name: 'LogIn' }
  }

  // 🟢 logged in → block login/signup
  if (user && authPages.includes(to.name)) {
    return { name: 'WelliCome' }
  }

  // 🟢 allow navigation
})

export default router
