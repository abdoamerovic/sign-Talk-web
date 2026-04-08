<template>
  <section class="container">
    <div class="signup-box">
      <h2>Create Account</h2>
      <form @submit.prevent="handleSignUp">
        <div class="input-group">
          <label>First Name</label>
          <input v-model="firstName" type="text" placeholder="First Name" />
          <small class="error">{{ errors.firstName }}</small>
        </div>

        <div class="input-group">
          <label>Last Name</label>
          <input v-model="lastName" type="text" placeholder="Last Name" />
          <small class="error">{{ errors.lastName }}</small>
        </div>

        <div class="input-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="Email" />
          <small class="error">{{ errors.email }}</small>
        </div>

        <div class="input-group">
          <label>Address</label>
          <input v-model="address" type="text" placeholder="Your Address" />
          <small class="error">{{ errors.address }}</small>
        </div>

        <div class="input-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Password" />
          <small class="error">{{ errors.password }}</small>
        </div>

        <button type="submit" class="btn-primary">Sign Up</button>
      </form>
    </div>
  </section>
</template>

<script>
import { ref, reactive } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../assets/js/firebase' // firebase.js
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

export default {
  name: 'SignUp',
  setup() {
    const router = useRouter()

    // بيانات المستخدم
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const address = ref('')
    const password = ref('')

    // أخطاء الـ form
    const errors = reactive({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      password: '',
    })

    const handleSignUp = async () => {
      // مسح الأخطاء القديمة
      Object.keys(errors).forEach((key) => (errors[key] = ''))

      if (!firstName.value) errors.firstName = 'Required'
      if (!lastName.value) errors.lastName = 'Required'
      if (!email.value) errors.email = 'Required'
      if (!address.value) errors.address = 'Required'
      if (!password.value) errors.password = 'Required'

      if (Object.values(errors).some((e) => e)) return

      try {
        // إنشاء حساب في Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value,
        )

        // حفظ بيانات المستخدم في Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          address: address.value,
        })

        // تحويل المستخدم على صفحة العمل
        // بعد التأكد من تسجيل الدخول
        if (auth.currentUser) {
          router.push('/WillyHome')
        } else {
          // أحيانًا ممكن تاخد ثانية، نستخدم setTimeout صغير
          setTimeout(() => router.push('/WillyHome'), 500)
        }
      } catch (error) {
        alert(error.message)
      }
    }

    return {
      firstName,
      lastName,
      email,
      address,
      password,
      errors,
      handleSignUp,
    }
  },
}
</script>

<style scoped>
/* نسخ الـ CSS اللي عندك من signup.css */
:root {
  --primary-color: #007bff;
  --secondary-color: #00bfff;
  --accent-color: #e3a81f;
  --bg-color: #ffffff;
  --text-color: #545454;
  --error-color: red;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: var(--bg-color);
}

.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.signup-box {
  width: 400px;
  max-width: 100%;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--primary-color);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.signup-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.signup-box h2 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-color);
}

.input-group input {
  width: 95%;
  padding: 12px;
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  outline: none;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.input-group input:hover,
.input-group input:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 5px var(--secondary-color);
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  margin-top: 10px;
}

.btn-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.error {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 3px;
  display: block;
}
</style>
