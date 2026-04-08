<template>
  <div class="container">
    <h1>SignTalk explaining video</h1>

    <button class="back-btn" @click="goBack">← Back To service</button>

    <div class="controls">
      <input v-model="text" placeholder="Type 'hello' or 'yes'..." @keyup.enter="translate" />
      <button @click="startVoice">🎤 Voice</button>
      <button @click="translate">Translate</button>
    </div>

    <div ref="avatarContainer" class="avatar-box">
      <iframe
        v-if="videoUrl"
        :src="videoUrl"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
      >
      </iframe>
    </div>
  </div>
</template>

<script>
import { wordDictionary } from '@/assets/js/worddectionary'

export default {
  name: 'SomeVideo',

  data() {
    return {
      text: '',
      videoUrl: '',
    }
  },

  methods: {
    goBack() {
      this.$router ? this.$router.back() : window.history.back()
    },

    startVoice() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        alert('Sorry, your browser does not support Voice Recognition.')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log('Microphone is listening...')
      }

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript
        this.text = spokenText
        this.translate()
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        alert('Microphone error: ' + event.error)
      }

      recognition.start()
    },

    translate() {
      const word = this.text.replace(/[.,]/g, '').trim().toLowerCase()

      if (wordDictionary[word]) {
        this.videoUrl = wordDictionary[word]
      } else {
        alert('Word not found in dictionary')
      }
    },
  },
}
</script>

<style scoped>
.container {
  /* The new 3-color linear gradient background */
  background: linear-gradient(135deg, #5dade2, #ffffff, #5dade2);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Changed text color to dark grey for readability against the lighter background */
  color: #333;
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
  /* Added a slight border to the input so it stands out against the gradient */
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  cursor: pointer;
  background: #5dade2;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  /* Added a subtle shadow to make the buttons pop */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.avatar-box {
  width: 400px;
  height: 400px;
  border: 4px solid #ffd700;
  border-radius: 10px;
  overflow: hidden;
  /* Reverted back to white as requested */
  background: white;
}

.back-btn {
  position: absolute;
  top: 120px;
  left: 20px;
  background-color: #5dade2;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
