<template>
  <div class="container">

    <button class="back-btn" @click="goBack">← Back</button>

    <h1 class="title">SignTalk Video</h1>

    <div class="controls">
      <div class="controls-row">
        <input
          v-model="text"
          placeholder="Type 'hello' or 'yes'..."
          @keyup.enter="translate"
        />
        <button class="voice-btn" @click="startVoice">🎤</button>
      </div>
      <button class="translate-btn" @click="translate">🔤 Translate</button>
    </div>

    <div class="avatar-wrapper">
      <div ref="avatarContainer" class="avatar-box">
        <iframe
          v-if="videoUrl"
          :src="videoUrl"
          width="100%"
          height="100%"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <div v-else class="empty-state">🤟 Ready to translate</div>
      </div>
    </div>

  </div>
</template>

<script>
import { wordDictionary } from '@/assets/js/worddectionary'

export default {
  name: 'SomeVideo',
  data() {
    return { text: '', videoUrl: '' }
  },
  methods: {
    goBack() { this.$router.back() },

    startVoice() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SR) { alert('Use Chrome or Edge for voice.'); return }
      const r = new SR()
      r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1
      r.onresult = (e) => { this.text = e.results[0][0].transcript; this.translate() }
      r.onerror  = (e) => { console.error(e.error); alert('Microphone error: ' + e.error) }
      r.start()
    },

    translate() {
      const word = this.text.replace(/[.,]/g, '').trim().toLowerCase()
      if (wordDictionary[word]) this.videoUrl = wordDictionary[word]
      else alert('Word not found in dictionary')
    },
  },
}
</script>

<style scoped>
/* ── Reset ──────────────────────────────────────────────────────────────────── */
:global(html), :global(body) {
  margin: 0; padding: 0;
  background: #5dade2;
  min-height: 100%;
}
*, *::before, *::after { box-sizing: border-box; }

/* ── Container ──────────────────────────────────────────────────────────────── */
.container {
  background: linear-gradient(135deg, #5dade2, #ffffff, #5dade2);
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 110px 16px 40px;
  gap: 16px;
  overflow-x: hidden;
  color: #333;
}

/* ── Back button — fixed ────────────────────────────────────────────────────── */
.back-btn {
  position: fixed;
  top: 72px; left: 14px;
  z-index: 999;
  background: #5dade2;
  border: none; color: white;
  font-weight: bold; font-size: 13px;
  padding: 7px 14px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: background 0.3s;
}
.back-btn:hover { background: #2980b9; }

/* ── Title ──────────────────────────────────────────────────────────────────── */
.title {
  font-size: clamp(1.2rem, 5vw, 1.8rem);
  text-align: center;
  margin: 0;
  color: #333;
  font-weight: bold;
}

/* ── Controls ───────────────────────────────────────────────────────────────── */
.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 97%;
  max-width: 480px;
}

.controls-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

input {
  flex: 1; min-width: 0;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: white;
  color: #333;
  font-size: 15px;
  outline: none;
  transition: border 0.3s;
}
input:focus { border-color: #5dade2; }

.voice-btn {
  flex-shrink: 0;
  width: 48px; height: 48px; padding: 0;
  font-size: 20px; border-radius: 12px;
  background: #5dade2;
  border: none; color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: background 0.3s;
}
.voice-btn:hover { background: #2980b9; }

.translate-btn {
  width: 100%; padding: 13px;
  font-size: 16px; font-weight: bold;
  border-radius: 12px; border: none;
  color: white; cursor: pointer;
  background: linear-gradient(135deg, #5dade2, #2980b9);
  box-shadow: 0 4px 14px rgba(93,173,226,0.4);
  transition: opacity 0.2s, transform 0.2s;
}
.translate-btn:hover { opacity: 0.9; transform: scale(1.02); }

/* ── Avatar ─────────────────────────────────────────────────────────────────── */
.avatar-wrapper {
  width: 97%;
  max-width: 480px;
  margin: 0 auto;
}

.avatar-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 4px solid #ffd700;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.empty-state {
  display: flex; justify-content: center; align-items: center;
  height: 100%; color: #999; font-size: 18px;
}

/* ── Mobile 480px ───────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .container     { padding: 100px 0 32px; gap: 14px; }
  input          { font-size: 14px; padding: 10px 12px; }
  .voice-btn     { width: 44px; height: 44px; font-size: 18px; }
  .translate-btn { font-size: 15px; padding: 12px; }
  .controls, .avatar-wrapper { width: 97%; margin: 0 auto; }
}

/* ── Mobile 390px ───────────────────────────────────────────────────────────── */
@media (max-width: 390px) {
  .container     { padding: 95px 0 24px; gap: 10px; }
  .title         { font-size: 1.2rem; }
  input          { font-size: 13px; padding: 9px 10px; }
  .voice-btn     { width: 40px; height: 40px; font-size: 16px; }
  .translate-btn { font-size: 14px; padding: 10px; }
  .controls, .avatar-wrapper { width: 97%; margin: 0 auto; }
}
</style>
