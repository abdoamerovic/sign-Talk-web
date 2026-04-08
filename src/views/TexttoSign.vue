<template>
  <div class="container">
    <h1>SignTalk 3D Avatar Demo</h1>

    <button class="back-btn" @click="goBack">← Back To Camera</button>

    <div class="controls">
      <input
        v-model="text"
        placeholder="Type or say a sentence..."
        @keyup.enter="startTranslation"
        :disabled="isRecording"
      />

      <button @click="startVoice" :class="{ 'recording-btn': isRecording }" :disabled="isRecording">
        {{ isRecording ? '🔴 Listening...' : '🎤 Voice' }}
      </button>

      <button @click="startTranslation" :disabled="isRecording">Translate</button>
    </div>

    <div ref="avatarContainer" class="avatar-box">
      <iframe
        v-if="currentVideoUrl"
        :src="currentVideoUrl"
        class="magnified-video"
        frameborder="0"
        allow="autoplay; microphone"
        allowfullscreen
      ></iframe>

      <div v-else class="empty-state">
        <p>Ready to translate</p>
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
    return {
      text: '',
      currentVideoUrl: '',
      videoQueue: [],
      isRecording: false,
    }
  },

  methods: {
    goBack() {
      this.$router ? this.$router.back() : window.history.back()
    },

    startVoice() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        alert(
          "Sorry, your browser doesn't support voice recognition. Please use Google Chrome or Edge.",
        )
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US' // Change to ar-SA for Arabic
      recognition.interimResults = false

      recognition.onstart = () => {
        this.isRecording = true
        this.text = ''
      }

      recognition.onresult = (event) => {
        this.text = event.results[0][0].transcript
        this.startTranslation()
      }

      recognition.onerror = (event) => {
        console.error('Speech error:', event.error)
        this.isRecording = false
        alert('Could not hear you. Please try again.')
      }

      recognition.onend = () => {
        this.isRecording = false
      }

      recognition.start()
    },

    startTranslation() {
      if (!this.text.trim()) return

      this.currentVideoUrl = ''
      this.videoQueue = []

      const input = this.text
        .trim()
        .toLowerCase()
        .replace(/[.,!?]/g, '')

      // 1. Check if the whole sentence is in the dictionary
      if (wordDictionary[input]) {
        this.videoQueue.push(this.formatUrl(wordDictionary[input]))
      } else {
        // 2. Otherwise, break it into individual words
        const words = input.split(/\s+/)
        words.forEach((word) => {
          if (wordDictionary[word]) {
            this.videoQueue.push(this.formatUrl(wordDictionary[word]))
          } else {
            console.warn(`No sign found for: ${word}`)
          }
        })
      }

      // Start playing the first video
      if (this.videoQueue.length > 0) {
        this.playNextInQueue()
      } else {
        alert('No signs found in the dictionary for this text.')
      }
    },

    formatUrl(videoIdentifier) {
      if (!videoIdentifier) return '';

      // 1. لو الرابط جاهز ومعموله Embed من الأول، نرجعه زي ما هو
      if (videoIdentifier.includes('youtube.com/embed/')) {
        return videoIdentifier.includes('autoplay=1')
          ? videoIdentifier
          : `${videoIdentifier}${videoIdentifier.includes('?') ? '&' : '?'}autoplay=1&mute=1`;
      }

      // 2. لو الرابط كامل (watch أو shorts)
      const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^#&?]{11})/;
      const match = videoIdentifier.match(regExp);

      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=1`;
      }

      // 3. لو كان ID بس مكون من 11 حرف
      if (videoIdentifier.length === 11 && !videoIdentifier.includes('/')) {
        return `https://www.youtube.com/embed/${videoIdentifier}?autoplay=1&mute=1&controls=1`;
      }

      // 4. لو هو رابط خارجي أو مسار لملف محلي (زي .mp4) نرجعه زي ما هو
      return videoIdentifier;
    },

    playNextInQueue() {
      if (this.videoQueue.length === 0) {
        this.currentVideoUrl = ''
        return
      }
      // Pull the next video from the queue and play it
      this.currentVideoUrl = this.videoQueue.shift()
    },
  },
}
</script>

<style scoped>
.container {
  /* The new animated gradient background */
  background: linear-gradient(-45deg, #046a95, #203a43, #83bbe0);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;

  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Add this right below the .container to make the animation work */
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

input {
  padding: 10px;
  border-radius: 5px;
  border: none;
  width: 250px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
  background: #5dade2;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  transition: 0.3s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recording-btn {
  background: #e74c3c !important;
  animation: pulse-bg 1s infinite alternate;
}

@keyframes pulse-bg {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

.avatar-box {
  width: 400px;
  height: 400px;
  border: 4px solid #5dade2;
  border-radius: 10px;
  overflow: hidden;
  background: white;
  position: relative;
}

/* Kept the magnification for you! */
.magnified-video {
  width: 100%;
  height: 100%;
  transform: scale(1.35);
  transform-origin: center center;
  pointer-events: none;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #333;
}

.back-btn {
  position: absolute;
  top: 120px;
  left: 20px;
  background-color: #5dade2;
}

/* Styles for the new Next Sign button */
.next-controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.queue-text {
  font-size: 14px;
  color: #aaa;
  margin: 0;
}

.next-btn {
  background-color: #2ecc71;
  font-size: 16px;
  padding: 12px 24px;
}
.next-btn:hover {
  background-color: #27ae60;
}
</style>
