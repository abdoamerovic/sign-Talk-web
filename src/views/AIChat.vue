<script setup>
import { ref } from 'vue'
import Groq from 'groq-sdk'

const messages = ref([])
const input = ref('')
const loading = ref(false)

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

const sendMessage = async () => {
  if (!input.value.trim() || loading.value) return

  const userMsg = input.value
  messages.value.push({ role: 'user', text: userMsg })
  input.value = ''
  loading.value = true

  try {
    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: userMsg }]
    })

    const reply = result.choices[0].message.content
    messages.value.push({ role: 'ai', text: reply })

  } catch (err) {
    console.log('FULL ERROR:', err)
    messages.value.push({
      role: 'ai',
      text: err?.message || 'Error connecting to AI 😢'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="chat-container">
    <h2>AI Chat 🤖</h2>

    <div class="chat-box" ref="chatBox">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="msg.role === 'user' ? 'user' : 'ai'"
      >
        {{ msg.text }}
      </div>
      <div v-if="loading" class="typing">Typing...</div>
    </div>

    <div class="input-box">
      <input
        v-model="input"
        @keyup.enter="sendMessage"
        placeholder="Ask anything..."
        :disabled="loading"
      />
      <button @click="sendMessage" :disabled="loading">
        {{ loading ? '...' : 'Send' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 650px;
  margin: 120px auto;
  padding: 20px;
  border: 2px solid gold;
  border-radius: 16px;
  background: #ffffff;
  color: rgb(0, 128, 240);
  box-shadow: 0 0 15px rgba(245, 209, 4, 0.939);
}

.chat-container h2 {
  margin: 0 0 16px;
  color: rgb(0, 123, 255);
}

.chat-box {
  height: 420px;
  overflow-y: auto;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  background: #595b5d;
}

.user {
  text-align: right;
  background: #1e90ff;
  margin: 6px 0;
  padding: 10px 14px;
  border-radius: 16px 16px 4px 16px;
  max-width: 80%;
  margin-left: auto;
  color: rgb(86, 82, 82);
  word-break: break-word;
}

.ai {
  text-align: left;
  background: #0ee3ff;
  margin: 6px 0;
  padding: 10px 14px;
  border-radius: 16px 16px 16px 4px;
  max-width: 80%;
  word-break: break-word;
  color: #535151;
}

.typing {
  font-style: italic;
  opacity: 0.5;
  margin: 6px;
  font-size: 13px;
}

.input-box {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid gold;
  outline: none;
  background: #595656;
  color: white;
  font-size: 15px;
}

input:disabled {
  opacity: 0.5;
}

button {
  padding: 10px 20px;
  background: gold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  transition: background 0.2s, opacity 0.2s;
}

button:hover:not(:disabled) {
  background: #e6c200;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
