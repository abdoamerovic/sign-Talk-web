<template>
  <section class="container">
    <section class="form_1">
      <h3>Sign talk translator</h3>
      <h2>See spoken words come to life in sign talk translator</h2>
      <p>
        Experience the magic of real-time <br />
        translation as spoken words are <br />
        instantly converted into sign language, bridging communication gaps and <br />fostering
        inclusivity.
      </p>
      <img src="../assets/images/support_1.jpg" alt="Login Image" />
    </section>

    <section class="form_2">
      <h1>SignTalk: Speak. Translate. Connect.</h1>

      <form @submit.prevent="handleLogin">
        <label class="labele" for="email">Email</label><br />
        <input
          v-model="email"
          class="ptn_1"
          type="email"
          placeholder="you@example.com"
          required
        /><br />

        <label class="labele" for="password">Password</label><br />
        <input
          v-model="password"
          class="ptn_1"
          type="password"
          placeholder="Enter your password"
          required
          minlength="8"
        /><br />
        <button class="ptn_2" type="submit">Login</button>
      </form>

      <section class="separator">
        <hr />
        <span>or</span>
        <hr />
      </section>

      <button class="google-btn" @click="loginWithGoogle">Login with Google</button>
      <button class="Apple-btn" @click="loginWithGithub">Login with Github</button>

      <span class="signup-link">
        <p>Don't have an account?</p>
        <router-link to="/signup">Create one for free</router-link>
      </span>
    </section>
  </section>
</template>

<script>
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  getAdditionalUserInfo // <-- NEW: Helps us check if it's a brand new user
} from 'firebase/auth'
import { doc, updateDoc, increment } from 'firebase/firestore' // <-- NEW: Firestore functions
import { auth, db } from '../assets/js/firebase' // <-- NEW: Imported db alongside auth
import { useRouter } from 'vue-router'
import { useUserStore } from '../assets/stores/user.js'

export default {
  name: 'LogIn',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const email = ref('')
    const password = ref('')

    // --- NEW FUNCTION: Adds +1 to Firebase Database ---
    const incrementNewUserCount = async () => {
      try {
        const statsRef = doc(db, 'statistics', 'main_stats')
        await updateDoc(statsRef, { activeUsers: increment(1) })
      } catch (error) {
        console.error('Failed to add +1 to activeUsers:', error)
      }
    }

    const handleLogin = async () => {
      try {
        // 1. تسجيل الدخول
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user

        // 2. حفظ البيانات في الـ State
        userStore.setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL,
        })

        // 3. التوجيه لصفحة الهوم
        router.push('/WillyHome')
      } catch (error) {
        console.error('Login Error:', error)
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      }
    }

    const loginWithGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const user = result.user

        // --- NEW LOGIC: Check if this Google user just created their account right now ---
        const additionalInfo = getAdditionalUserInfo(result)
        if (additionalInfo && additionalInfo.isNewUser) {
          await incrementNewUserCount() // Add +1 to database!
        }

        userStore.setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
        router.push('/WillyHome')
      } catch (error) {
        console.error('Google Login Error:', error)
      }
    }

    const loginWithGithub = async () => {
      try {
        const provider = new OAuthProvider('github.com')
        const result = await signInWithPopup(auth, provider)
        const user = result.user

        // --- NEW LOGIC: Check if this Github user just created their account right now ---
        const additionalInfo = getAdditionalUserInfo(result)
        if (additionalInfo && additionalInfo.isNewUser) {
          await incrementNewUserCount() // Add +1 to database!
        }

        // تحديث الـ store بالـ user
        userStore.setUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || '',
        })

        // التوجيه لو سجل الدخول ناجح
        if (user && user.uid) {
          router.push('/WillyHome')
        }
      } catch (error) {
        if (error.code === 'auth/account-exists-with-different-credential') {
          router.push('/WillyHome')
        } else {
          console.error('GitHub Login Error:', error)
        }
      }
    }

    return {
      email,
      password,
      handleLogin,
      loginWithGoogle,
      loginWithGithub,
    }
  },
}
</script>

<style scoped>
:root {
  --primary-color: #007BFF;   /* أزرق أساسي */
  --secondary-color: #00BFFF; /* أزرق فاتح */
  --accent-color: #e3a81f;    /* بنى فاتح */
  --bg-color: #FFFFFF;        /* خلفية بيضاء */
  --text-color: #545454;      /* نص داكن */
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color), var(--bg-color));
  border: var(--accent-color) 4px solid;
  border-radius: 20px;
}

.form_1 {
  width: 40%;
  height: 680px;
}

.form_2 {
  width: 58%;
  height: 550px;
  background-color: var(--bg-color);
  border: var(--accent-color) 2px solid;
}

.form_1, .form_2 {
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form_1 h3, .form_2 h3 {
  color: var(--text-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px 22px rgba(255, 255, 255, 0.847);
  text-align: center;
  width: 90%;
  border-radius: 40px;
  margin-left: 5%;
  margin-top: 25%;
}

.form_1 h2 {
  color: var(--text-color);
  font-size: 18px;
  text-align: center;
  width: 90%;
  margin-left: 4%;
}

.form_1 p, .form_2 p {
  color: var(--text-color);
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  width: 90%;
  margin-left: 4%;
}

.form_1 img {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  display: block;
  margin: 20px auto 0 auto;
  box-shadow: 5px 5px 22px rgba(255, 255, 255, 0.888);
}

/* form_2 */
.labele {
  display: block;
  font-size: 20px;
  font-weight: bold;
}

.form_2 form {
  padding-left: 2%;
}

.ptn_1, .ptn_2 {
  width: 86%;
  padding: 8px;
  border: 1px solid var(--primary-color);
  border-radius: 20px;
  font-size: 16px;
}

.form_2 h1 {
  font-size: 27px;
  font-weight: 800;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 15px;
  line-height: 1.2;
  letter-spacing: 1px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.form_2 h1:hover {
  color: var(--secondary-color);
  transform: scale(1.05);
}

.ptn_2 {
  margin-top: 30px;
  width: 90%;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  cursor: pointer;
}

.signup-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: var(--text-color);
}

.signup-link p {
  margin: 0;
}

.signup-link a {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: -200px;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: var(--secondary-color);
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  gap: 10px;
  margin: 20px 0;
}

.separator hr {
  flex: 1;
  border: none;
  height: 1px;
  background-color: var(--primary-color);
}

.separator span {
  white-space: nowrap;
  color: var(--text-color);
  font-weight: bold;
}

.google-btn, .Apple-btn {
  width: 90%;
  height: auto;
  padding: 7px;
  margin: 1px 0 2px 2%;
  border: 1px solid var(--primary-color);
  border-radius: 20px;
  font-size: 18px;
  cursor: pointer;
}

.google-btn, .Apple-btn, .ptn_1 {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid var(--accent-color);
  border-radius: 6px;
}

.ptn_1:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.25);
  border: var(--primary-color) 3px solid;
  transition: transform 0.2s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.ptn_2:hover, .google-btn:hover, .Apple-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.25);
  border-color: var(--secondary-color);
}
</style>
