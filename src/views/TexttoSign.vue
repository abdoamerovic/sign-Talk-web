<template>
  <div class="container">

    <!-- Back button fixed — مش في الـ flow خالص -->
    <button class="back-btn" @click="goBack">← Back</button>

    <h1 class="title">SignTalk</h1>

    <div class="controls">
      <div class="controls-row">
        <input
          v-model="text"
          placeholder="Type a sentence..."
          @keyup.enter="startTranslation"
          :disabled="isRecording"
        />
        <button
          class="voice-btn"
          @click="startVoice"
          :class="{ 'recording-btn': isRecording }"
          :disabled="isRecording"
        >
          {{ isRecording ? '🔴' : '🎤' }}
        </button>
      </div>

      <button class="translate-btn" @click="startTranslation" :disabled="isRecording">
        🔤 Translate
      </button>
    </div>

    <div class="avatar-wrapper">
      <div class="avatar-box">
        <iframe
          v-if="currentVideoUrl"
          :src="currentVideoUrl"
          class="magnified-video"
          frameborder="0"
          allow="autoplay; microphone"
          allowfullscreen
        ></iframe>
        <div v-else class="empty-state">🤟 Ready to translate</div>
      </div>
    </div>

    <div v-if="videoQueue.length > 0" class="next-controls">
      <p class="queue-text">{{ videoQueue.length }} sign(s) left</p>
      <button class="next-btn" @click="playNextInQueue">Next Sign ➔</button>
    </div>

  </div>
</template>

<script>
import { wordDictionary } from '@/assets/js/worddectionary'

export default {
  name: 'TexttoSign',
  data() {
    return { text: '', currentVideoUrl: '', videoQueue: [], isRecording: false }
  },
  methods: {
    goBack() { this.$router.replace({ name: 'Video' }) },
    startVoice() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SR) { alert('Use Chrome or Edge for voice.'); return }
      const r = new SR()
      r.lang = 'en-US'; r.interimResults = false
      r.onstart  = () => { this.isRecording = true; this.text = '' }
      r.onresult = (e) => { this.text = e.results[0][0].transcript; this.startTranslation() }
      r.onerror  = (e) => { console.error(e.error); this.isRecording = false }
      r.onend    = () => { this.isRecording = false }
      r.start()
    },
    startTranslation() {
      if (!this.text.trim()) return
      this.currentVideoUrl = ''; this.videoQueue = []
      const input = this.text.trim().toLowerCase().replace(/[.,!?]/g, '')
      if (wordDictionary[input]) {
        this.videoQueue.push(this.formatUrl(wordDictionary[input]))
      } else {
        input.split(/\s+/).forEach(w => {
          if (wordDictionary[w]) this.videoQueue.push(this.formatUrl(wordDictionary[w]))
        })
      }
      if (this.videoQueue.length) this.playNextInQueue()
      else alert('No signs found.')
    },
    formatUrl(v) {
      if (!v) return ''
      if (v.includes('youtube.com/embed/'))
        return v.includes('autoplay=1') ? v : `${v}${v.includes('?') ? '&' : '?'}autoplay=1&mute=1`
      const m = v.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^#&?]{11})/)
      if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&mute=1&controls=1`
      if (v.length === 11 && !v.includes('/')) return `https://www.youtube.com/embed/${v}?autoplay=1&mute=1&controls=1`
      return v
    },
    playNextInQueue() {
      this.currentVideoUrl = this.videoQueue.length ? this.videoQueue.shift() : ''
    },
  },
}
</script>

<style scoped>
/* ── Reset ──────────────────────────────────────────────────────────────────── */
:global(html), :global(body) {
  margin: 0; padding: 0;
  background: #203a43;
  min-height: 100%;
}
*, *::before, *::after { box-sizing: border-box; }

/* ── Container ──────────────────────────────────────────────────────────────── */
.container {
  background: linear-gradient(-45deg, #046a95, #203a43, #83bbe0);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding-top كبير عشان الـ back button fixed مش تغطي المحتوى */
  padding: 110px 16px 40px;
  gap: 16px;
  overflow-x: hidden;   /* ✅ يمنع أي overflow أفقي */
}

@keyframes gradientBG {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ── Back button — fixed مش في الـ flow ─────────────────────────────────────── */
.back-btn {
  position: fixed;        /* ✅ fixed = مش بياثر على باقي العناصر */
  top: 72px;
  left: 14px;
  z-index: 999;
  background: rgba(93,173,226,0.9);
  backdrop-filter: blur(6px);
  border: none; color: white;
  font-weight: bold; font-size: 13px;
  padding: 7px 14px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  transition: background 0.3s;
}
.back-btn:hover { background: rgba(41,128,185,0.95); }

/* ── Title ──────────────────────────────────────────────────────────────────── */
.title {
  font-size: clamp(1.3rem, 5vw, 2rem);
  text-align: center;
  margin: 0;
  color: white;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* ── Controls ───────────────────────────────────────────────────────────────── */
.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 97%;             /* ✅ نفس عرض الـ avatar تقريباً */
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
  border: 2px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.15);
  color: white; font-size: 15px;
  outline: none;
  transition: border 0.3s;
}
input::placeholder { color: rgba(255,255,255,0.55); }
input:focus        { border-color: #5dade2; }
input:disabled     { opacity: 0.5; }

.voice-btn {
  flex-shrink: 0;
  width: 48px; height: 48px; padding: 0;
  font-size: 20px; border-radius: 12px;
  background: rgba(93,173,226,0.85);
  border: none; color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.3s;
}
.voice-btn:hover:not(:disabled) { background: #2980b9; }
.voice-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.recording-btn { background: #e74c3c !important; animation: pulse-bg 1s infinite alternate; }
@keyframes pulse-bg {
  0%   { transform: scale(1); }
  100% { transform: scale(1.06); }
}

.translate-btn {
  width: 100%; padding: 13px;
  font-size: 16px; font-weight: bold;
  border-radius: 12px; border: none; color: white; cursor: pointer;
  background: linear-gradient(135deg, #007bff, #00bfff);
  box-shadow: 0 4px 14px rgba(0,123,255,0.35);
  transition: opacity 0.2s, transform 0.2s;
}
.translate-btn:hover:not(:disabled) { opacity: 0.9; transform: scale(1.02); }
.translate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Avatar wrapper ─────────────────────────────────────────────────────────── */
.avatar-wrapper {
  /* ✅ 97% من عرض الشاشة — يسيب 1.5% من كل جانب */
  width: 97%;
  max-width: 480px;
  margin: 0 auto;
}

.avatar-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 3px solid rgba(93,173,226,0.8);
  border-radius: 20px;
  overflow: hidden;
  background: white;
  box-shadow:
    0 0 0 4px rgba(93,173,226,0.12),
    0 10px 36px rgba(0,0,0,0.3);
}

.magnified-video {
  width: 100%; height: 100%;
  transform: scale(1.35);
  transform-origin: center center;
  pointer-events: none;
  display: block;
}

.empty-state {
  display: flex; justify-content: center; align-items: center;
  height: 100%; color: #555; font-size: 18px;
}

/* ── Next controls ──────────────────────────────────────────────────────────── */
.next-controls {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.queue-text { font-size: 13px; color: rgba(255,255,255,0.7); margin: 0; }
.next-btn {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  font-size: 15px; padding: 11px 26px;
  border-radius: 12px; border: none;
  color: white; font-weight: bold; cursor: pointer;
  box-shadow: 0 4px 14px rgba(46,204,113,0.4);
  transition: opacity 0.2s;
}
.next-btn:hover { opacity: 0.88; }

/* ── Mobile 480px ───────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .container  { padding: 100px 0 32px; gap: 14px; }
  .title      { font-size: 1.4rem; }
  input       { font-size: 14px; padding: 10px 12px; }
  .voice-btn  { width: 44px; height: 44px; font-size: 18px; }
  .translate-btn { font-size: 15px; padding: 12px; }
  .next-btn   { font-size: 14px; padding: 10px 22px; }

  /* controls وـ avatar نفس العرض بالظبط */
  .controls,
  .avatar-wrapper {
    width: 97%;
    margin: 0 auto;
  }
}

/* ── Mobile 390px ───────────────────────────────────────────────────────────── */
@media (max-width: 376px) {
  .container  { padding: 95px 0 24px; gap: 10px; }
  .title      { font-size: 1.2rem; }
  input       { font-size: 13px; padding: 9px 10px; }
  .voice-btn  { width: 40px; height: 40px; font-size: 16px; }
  .translate-btn { font-size: 14px; padding: 10px; }
  .next-btn   { font-size: 13px; padding: 9px 18px; }
  .queue-text { font-size: 12px; }

  .controls,
  .avatar-wrapper {
    width: 90%;
    margin: 0 auto;
  }
  .avatar-box {
    width: 98%;
  }
}

</style>
