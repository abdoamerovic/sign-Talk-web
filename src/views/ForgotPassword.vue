<template>
  <section class="forgot-password-page">
    <div class="badge-card">
      <div class="badge-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>

      <h2>Reset Password</h2>
      <p class="subtitle">Enter your email and we'll send you a link to reset your password.</p>

      <form @submit.prevent="handleReset">
        <div class="input-group">
          <input
            type="email"
            v-model="email"
            placeholder="Enter your email address"
            required
          />
        </div>

        <p v-if="successMsg" class="success-message">{{ successMsg }}</p>
        <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div class="footer-links">
        <router-link to="/login" class="back-link">← Back to Login</router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

export default {
  setup() {
    const email = ref('')
    const successMsg = ref('')
    const errorMsg = ref('')
    const isLoading = ref(false)

    const handleReset = async () => {
      // Clear previous messages
      successMsg.value = ''
      errorMsg.value = ''
      isLoading.value = true

      const auth = getAuth()

      try {
        await sendPasswordResetEmail(auth, email.value)
        successMsg.value = 'Success! Check your email inbox for the reset link.'
        email.value = '' // clear the input
      } catch (error) {
        // Handle Firebase error codes nicely
        if (error.code === 'auth/user-not-found') {
          errorMsg.value = 'No account found with this email.'
        } else if (error.code === 'auth/invalid-email') {
          errorMsg.value = 'Please enter a valid email address.'
        } else {
          errorMsg.value = 'Failed to send reset email. Please try again.'
        }
        console.error(error)
      } finally {
        isLoading.value = false
      }
    }

    return { email, successMsg, errorMsg, isLoading, handleReset }
  }
}
</script>

<style scoped>
.forgot-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: var(--bg-color, #f4f7f6);
}

.badge-card {
  background: white;
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  position: relative;
}

.badge-icon {
  width: 80px;
  height: 80px;
  background-color: #e6f2ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
}

h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
  line-height: 1.5;
}

.input-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 14px 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #a0cbfc;
  cursor: not-allowed;
}

.success-message {
  color: #28a745;
  font-size: 14px;
  margin-bottom: 15px;
  background-color: #e6f9ea;
  padding: 10px;
  border-radius: 8px;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 15px;
  background-color: #fbebed;
  padding: 10px;
  border-radius: 8px;
}

.footer-links {
  margin-top: 25px;
}

.back-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
}

.back-link:hover {
  text-decoration: underline;
  color: #0056b3;
}
</style>
