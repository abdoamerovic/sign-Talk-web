<template>
  <div class="widget">
    <div class="header">
      <div class="dot"></div>
      <div>
        <h1>Gemini Chat</h1>
        <span>Talking directly to the Gemini API</span>
      </div>
    </div>

    <div class="messages" ref="messagesEl">
      <div
        v-for="(m, i) in displayMessages"
        :key="i"
        class="msg"
        :class="m.cls"
      >{{ m.text }}</div>
    </div>

    <div class="composer">
      <textarea
        v-model="input"
        rows="1"
        placeholder="Type a message..."
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
      <button @click="sendMessage" :disabled="sending">➤</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

// cspell:ignore vite Vite VITE
// Reads the key from your .env file (see .env.example).
// Note: this relies on vite.config.js allowing the "GEMINI_" prefix
// (Vite only exposes VITE_-prefixed vars to client code by default).
// The key is still visible to anyone who inspects the page. For a public
// site, proxy this call through a small backend instead.

defineOptions({
  name: "ChatWidget"
});
const apiKey = import.meta.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash"; // swap for another Gemini model if you like

const input = ref("");
const sending = ref(false);
const messagesEl = ref(null);

// what's shown on screen
const displayMessages = ref([
  { text: "Hi! Ask me anything.", cls: "bot" }
]);

// what's actually sent to the API (role/parts format Gemini expects)
let history = [];

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    }
  });
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text || sending.value) return;

  displayMessages.value.push({ text, cls: "user" });
  history.push({ role: "user", parts: [{ text }] });
  input.value = "";
  sending.value = true;
  scrollToBottom();

  const pendingIndex = displayMessages.value.push({
    text: "Gemini is thinking…",
    cls: "bot pending"
  }) - 1;
  scrollToBottom();

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const message = data?.error?.message || "Request failed.";
      displayMessages.value.splice(pendingIndex, 1);
      displayMessages.value.push({ text: message, cls: "error" });
      history.pop();
      return;
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "(no response)";

    displayMessages.value.splice(pendingIndex, 1);
    displayMessages.value.push({ text: reply, cls: "bot" });
    history.push({ role: "model", parts: [{ text: reply }] });
  } catch (err) {
    displayMessages.value.splice(pendingIndex, 1);
    displayMessages.value.push({
      text: "Network error: " + err.message,
      cls: "error"
    });
    history.pop();
  } finally {
    sending.value = false;
    scrollToBottom();
  }
}
</script>

<style scoped>
:root {
  --blue: #007bff;
  --gold: #e3a81f;
}
.widget {
  --ink: #1b1f27;
  --paper: #f7f8fa;
  --border: #e1e4ea;
  width: 100%;
  max-width: 420px;
  background: var(--paper);
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(20, 30, 60, 0.15);
  overflow: hidden;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 640px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
}
.header {
  background: linear-gradient(120deg, #007bff 0%, #0057b8 100%);
  color: #fff;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.header .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e3a81f;
  box-shadow: 0 0 0 3px rgba(227, 168, 31, 0.25);
}
.header h1 {
  font-size: 15px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.2px;
}
.header span {
  font-size: 12px;
  opacity: 0.85;
  display: block;
}
.messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: radial-gradient(
      circle at 20% 0%,
      rgba(0, 123, 255, 0.05),
      transparent 40%
    ),
    var(--paper);
}
.msg {
  max-width: 78%;
  padding: 10px 13px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}
.msg.user {
  align-self: flex-end;
  background: #007bff;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.msg.bot {
  align-self: flex-start;
  background: #ffffff;
  border: 1px solid var(--border);
  border-bottom-left-radius: 4px;
  color: var(--ink);
}
.msg.bot.pending {
  color: #8a8f98;
  font-style: italic;
}
.msg.error {
  align-self: flex-start;
  background: #fff4e5;
  border: 1px solid #e3a81f;
  color: #7a5300;
}
.composer {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  background: #fff;
  border-top: 1px solid var(--border);
}
.composer textarea {
  flex: 1;
  resize: none;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  max-height: 90px;
}
.composer textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.12);
}
.composer button {
  border: none;
  background: #007bff;
  color: #fff;
  width: 44px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  flex-shrink: 0;
}
.composer button:disabled {
  background: #9cc4f2;
  cursor: not-allowed;
}
</style>
