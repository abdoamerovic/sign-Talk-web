<template>
  <section class="conti">
    <!-- HEADER -->
    <main-navbar />

    <!-- WELCOME -->
    <section class="welcome_bdg">
      <h1>Welcome to <span>sign talk</span></h1>
      <h2>
       

      </h2>

      <router-link to="/ServiceS" class="btn"> Get Started </router-link>
    </section>

    <!-- FEATURES -->
    <h1 class="lio">key features</h1>

    <section class="container_features">
      <div class="feature">
        <img src="@/assets/images/translate.jpg" />
        <h3>live Translation</h3>
        <p>Instant translation of spoken language into sign language and vice versa.</p>
      </div>

      <div class="feature">
        <img src="@/assets/images/dec.png" />
        <h3>Dictionary</h3>
        <p>Connect with other users and share experiences.</p>
      </div>

      <div class="feature">
        <img src="@/assets/images/OIP.webp" />
        <h3>video</h3>
        <p>you can know how to make the word to be connect</p>
      </div>

      <div class="feature">
        <img src="@/assets/images/comuni.jpg" />
        <h3>Community</h3>
        <p>Join a vibrant community of learners.</p>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="terminal">
      <img src="@/assets/images/aboutus.jpg" />
      <div class="about">
        <h1>Goals of <span>SignTalk</span></h1>
        <p>
          SignTalk aims to break communication barriers by providing real-time sign language
          translation.
        </p>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="contact_intro">
      <h1>Get in <span>SignTalk</span><br /></h1>
      <span class="s_1">speak.</span><span class="s_2">translate.</span
      ><span class="s_3">connect</span>

      <p>Have questions or ideas? We're always here to help.</p>

      <router-link to="/ConnectUss" class="contact_btn"> Contact Us </router-link>
    </section>

    <!-- FOOTER -->
    <footer>
      <div class="footer-content">
        <h1>SignTalk</h1>
        <div class="socials">
          <img src="@/assets/images/face.png" class="social-icon" @click="gotofacebook" />
          <img src="@/assets/images/linkedin.png" class="social-icon" @click="gotolinkedin" />
          <img src="@/assets/images/insta.jpg" class="social-icon" @click="gotoinsta" />
        </div>
      </div>

      <p>© 2026 SignTalk. All rights reserved.<span> abdo.e.amer7</span></p>
    </footer>
  </section>
</template>
<script>
import { ref, onMounted } from 'vue'
import { auth, db } from '../assets/js/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

import '@/assets/css/welcome.css'

export default {
  name: 'WelliCome',
  setup() {
    const firstName = ref('') // الاسم الأول

    // دوال الروابط
    const gotofacebook = () => {
      window.open('https://www.facebook.com/abdelrahman.amer.1800', '_blank')
    }
    const gotolinkedin = () => {
      window.open('https://www.linkedin.com/in/abdelrahman-amer-331b03317/', '_blank')
    }
    const gotoinsta = () => {
      window.open('https://www.instagram.com/abdo_e_amer7/', '_blank')
    }

    onMounted(() => {
      const user = auth.currentUser
      if (user) {
        const userRef = doc(db, 'users', user.uid)

        // Realtime listener
        onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            firstName.value = docSnap.data().firstName
          }
        })
      }

      // Burger menu
      let burger = document.getElementById('burger')
      let sideMenu = document.querySelector('.side_manu')
      if (burger && sideMenu) {
        burger.addEventListener('click', () => {
          sideMenu.classList.toggle('active')
        })
      }
    })

    return {
      firstName,
      gotofacebook,
      gotolinkedin,
      gotoinsta,
    }
  },
}
</script>
