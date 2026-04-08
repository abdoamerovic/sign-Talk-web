<template>
  <div class="video-page">
    <video ref="videoElement" autoplay playsinline></video>
    <canvas ref="canvasElement"></canvas>

    <div class="output-text">

      <div class="suggestions" v-if="candidateLetters.length > 0">
        <p>Did you mean?</p>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <button
            v-for="letter in candidateLetters"
            :key="letter"
            @click="addLetter(letter)"
            style="padding: 10px; background: #00ffcc; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;"
          >
            {{ letter }}
          </button>
        </div>
      </div>

      <div class="word-predictions" v-if="predictedWords.length > 0">
        <p>Word Predictions:</p>
        <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
          <button
            v-for="word in predictedWords"
            :key="word"
            @click="acceptPrediction(word)"
            style="padding: 10px; background: #ffcc00; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;"
          >
            {{ word }}
          </button>
        </div>
      </div>

      <div class="word">Current Word: <strong>{{ currentWord }}</strong></div>
      <div class="sentence">Full Sentence: <strong>{{ currentSentence }}</strong></div>

      <div class="controls" style="margin-top: 15px;">
        <button @click="addSpace">Next / Space</button>
        <button @click="cancelLetter">Delete Letter</button>
        <button @click="clearAll" class="clear-btn">Clear All</button>
        <button @click="speak" class="speak-btn">🔊 Speak</button>
      </div>

    </div>

    <button @click="toavatar" class="badge-toggle-btn">ForSign→</button>
    <button @click="goBack" class="back-btn">←ForService</button>
  </div>
</template>
<script>
import { Hands } from '@mediapipe/hands'

export default {
  name: 'VideoCall',

  data() {
    return {
      camera: null,
      currentWord: '',
      stream: null,
      currentSentence: '',

      // NEW: Replaced suggestedLetter with an array of candidates
      candidateLetters: [],
      lastLetter: '',
      stabilityCount: 0,
      stabilityThreshold: 15,
      showBadge: false,

      wordDictionary: [
        'A LOT', 'APPLE', 'AWESOME', 'BAD', 'BOY', 'BEAUTIFUL', 'CAT', 'CAR',
        'COOL', 'DOG', 'DAD', 'DAY', 'EAT', 'EASY', 'EVERY', 'FOOD', 'FRIEND',
        'FAMILY', 'GOOD', 'GIRL', 'GREAT', 'HELLO', 'HELP', 'HOME', 'HOW',
        'HAPPY', 'I', 'ICE', 'IDEA', 'JUMP', 'JOKE', 'JUST', 'KNOW', 'KEEP',
        'KIND', 'LOVE', 'LIKE', 'LITTLE', 'MOM', 'MORE', 'MANY', 'NO', 'NAME',
        'NICE', 'PLEASE', 'PLAY', 'PEOPLE', 'QUIT', 'QUICK', 'QUESTION',
        'RIGHT', 'READ', 'READY', 'SORRY', 'SOME', 'SCHOOL', 'THANK YOU',
        'TIME', 'TODAY', 'WATER', 'WORK', 'WANT', 'YES', 'YOU', 'YOUR',
        'ZEBRA', 'ZERO',
      ],
    }
  },

  computed: {
    predictedWords() {
      if (!this.currentWord) return []
      const search = this.currentWord.toUpperCase()
      return this.wordDictionary
        .filter((word) => word.startsWith(search))
        .sort((a, b) => a.length - b.length)
        .slice(0, 5)
    },
  },

  async mounted() {
    this.handleResize()
    await this.$nextTick()
    await this.startCamera()
    window.addEventListener('resize', this.handleResize)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.stopCamera()
  },

  methods: {
    // NEW: Function to manually add a letter from the suggestions
    addLetter(letter) {
      this.currentWord += letter
      this.candidateLetters = [] // Clear options after selecting
      this.stabilityCount = 0 // Reset stability
    },

    acceptPrediction(word) {
      this.currentSentence += word + ' '
      this.currentWord = ''
      this.candidateLetters = []
    },

    speak() {
      const utterance = new SpeechSynthesisUtterance(this.currentSentence)
      speechSynthesis.speak(utterance)
    },

    setupHands() {
      const video = this.$refs.videoElement
      const canvas = this.$refs.canvasElement
      const ctx = canvas.getContext('2d')

      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      })

      hands.onResults((results) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0]

          landmarks.forEach((point) => {
            ctx.beginPath()
            ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI)
            ctx.fillStyle = '#00ffcc'
            ctx.fill()
          })

          // Get multiple candidate letters instead of just one
          const candidates = this.getLetterCandidates(landmarks)
          const topCandidate = candidates[0]

          if (topCandidate) {
            if (topCandidate === this.lastLetter) {
              this.stabilityCount++
            } else {
              this.stabilityCount = 0
              this.lastLetter = topCandidate
            }

            // Once the hand is stable, show the candidates to the user
            if (this.stabilityCount > this.stabilityThreshold) {
              this.candidateLetters = candidates
              // Optional: auto-add the top letter here if you want it to type automatically,
              // but leaving it out forces the user to click and guarantees no mistakes.
            }
          }
        }
      })

      const processFrame = async () => {
        if (!this.stream) return
        await hands.send({ image: video })
        requestAnimationFrame(processFrame)
      }

      processFrame()
    },

    // NEW: Generates 4 possibilities based on hand shape
    getLetterCandidates(lm) {
      if (!lm || lm.length < 21) return []

      // 1. Get the absolute best match from your existing strict logic
      const bestMatch = this.detectLetter(lm)

      let candidates = new Set()
      if (bestMatch) candidates.add(bestMatch)

      // 2. Fuzzy Matching: Group letters by similar shapes to build fallbacks
      const getDist = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
      const wrist = lm[0]
      const palmLength = getDist(wrist, lm[9])

      const isUp = (tip, pip) => getDist(tip, wrist) > getDist(pip, wrist) + palmLength * 0.15
      const indexUp = isUp(lm[8], lm[6])
      const middleUp = isUp(lm[12], lm[10])
      const ringUp = isUp(lm[16], lm[14])
      const pinkyUp = isUp(lm[20], lm[18])

      const upCount = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length
      const isPointingDown = lm[5].y > wrist.y
      const isSideways = Math.abs(lm[5].y - wrist.y) < palmLength * 0.6

      if (isPointingDown) {
        ['P', 'Q'].forEach(l => candidates.add(l))
      } else if (isSideways) {
        ['H', 'G'].forEach(l => candidates.add(l))
      } else {
        // Grouping the hardest letters together based on how many fingers are up
        switch (upCount) {
          case 0:
            // If closed fist, suggest all closed-fist letters
            ['M', 'N', 'S', 'T', 'A', 'E', 'O', 'C'].forEach(l => candidates.add(l))
            break
          case 1:
            ['D', '1', 'L', 'I', 'Y', 'X'].forEach(l => candidates.add(l))
            break
          case 2:
            ['V', 'U', 'R', 'K'].forEach(l => candidates.add(l))
            break
          case 3:
            ['W', 'F'].forEach(l => candidates.add(l))
            break
          case 4:
            candidates.add('B')
            break
        }
      }

      // Return only the top 4 choices to keep the UI clean
      return Array.from(candidates).slice(0, 4)
    },

    // --- YOUR EXISTING LOGIC ---
   detectLetter(lm) {
  if (!lm || lm.length < 21) return null
  const getDist = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
  const wrist = lm[0]
  const thumbTip = lm[4]
  const indexTip = lm[8]; const indexPIP = lm[6]; const indexBase = lm[5]
  const middleTip = lm[12]; const middlePIP = lm[10]; const middleBase = lm[9]
  const ringTip = lm[16]; const ringPIP = lm[14]; const ringBase = lm[13]
  const pinkyTip = lm[20]; const pinkyPIP = lm[18]
  const palmLength = getDist(wrist, middleBase)
  const isUp = (tip, pip) => getDist(tip, wrist) > getDist(pip, wrist) + palmLength * 0.15

  const indexUp = isUp(indexTip, indexPIP)
  const middleUp = isUp(middleTip, middlePIP)
  const ringUp = isUp(ringTip, ringPIP)
  const pinkyUp = isUp(pinkyTip, pinkyPIP)
  const upCount = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length
  const thumbOut = getDist(thumbTip, indexBase) > palmLength * 0.5

  // 🔧 FIX P & Q: Much stricter — hand must be clearly pointing downward
  const isPointingDown = indexBase.y > wrist.y + palmLength * 0.3  // was: indexBase.y > wrist.y

  // 🔧 FIX G & H: Must be clearly horizontal, not just "a bit sideways"
  const isSideways = (
    Math.abs(indexBase.x - wrist.x) > Math.abs(indexBase.y - wrist.y) * 1.2 &&  // clearly horizontal
    Math.abs(indexBase.y - wrist.y) < palmLength * 0.35                           // was: 0.6
  )

  if (isPointingDown) {
    if (indexUp && middleUp && !ringUp && !pinkyUp) return 'P'
    if (indexUp && !middleUp && !ringUp && !pinkyUp && getDist(thumbTip, indexTip) > palmLength * 0.2) return 'Q'
    return null
  }

  if (isSideways) {
    if (indexUp && middleUp && !ringUp && !pinkyUp) return 'H'
    if (indexUp && !middleUp && !ringUp && !pinkyUp) return 'G'
    if (indexUp && !middleUp && !ringUp && !pinkyUp) return 'H'
  }

  switch (upCount) {case 0:
  // 🔧 FIX E: كل الأصابع الأربعة العليا لازم تكون تحت مفاصل PIP (مقبوضة)
  if (
    indexTip.y > indexPIP.y + palmLength * 0.05 &&
    middleTip.y > middlePIP.y + palmLength * 0.05 &&
    ringTip.y > ringPIP.y + palmLength * 0.05 &&
    pinkyTip.y > pinkyPIP.y + palmLength * 0.05
  ) {
    return 'E'
  }

  // بعد كده الحروف العادية
  if (!thumbOut && thumbTip.y < indexPIP.y && getDist(thumbTip, indexBase) < palmLength * 0.4) return 'A'
  if (getDist(thumbTip, indexTip) < palmLength * 0.3 && getDist(thumbTip, middleTip) < palmLength * 0.3) return 'O'
  if (getDist(indexTip, wrist) > palmLength * 0.7 && getDist(thumbTip, indexTip) > palmLength * 0.4) return 'C'
  if (indexTip.y > indexPIP.y && indexPIP.y < indexBase.y) return 'X'

  // 🔧 FIX T: قبل N و M
  if (
    getDist(thumbTip, indexBase) < palmLength * 0.35 &&
    thumbTip.x > indexBase.x - palmLength * 0.2 &&
    thumbTip.x < middleBase.x + palmLength * 0.2 &&
    thumbTip.y > wrist.y - palmLength * 0.4
  ) return 'T'

  if (getDist(thumbTip, middlePIP) < palmLength * 0.3 && thumbTip.y < indexPIP.y + palmLength * 0.2) return 'S'
  if (getDist(thumbTip, middleBase) < getDist(thumbTip, ringBase)) return 'N'
  return 'M'

    case 1:
      if (indexUp) {
        if (thumbOut) return 'L'
        if (getDist(thumbTip, middleTip) < palmLength * 0.35) return 'D'
        return '1'
      }
      if (pinkyUp) {
        if (thumbOut) return 'Y'
        return 'I'
      }
      break

    case 2:
      if (indexUp && middleUp) {
        const tipsDist = getDist(indexTip, middleTip)
        if (tipsDist < palmLength * 0.15 && middleTip.y > indexTip.y) return 'U'
        if (tipsDist < palmLength * 0.25) return 'R'
        if (getDist(thumbTip, middleBase) <= palmLength * 0.35) return 'K'
        return 'V'
      }
      break

    case 3:
      if (indexUp && middleUp && ringUp) return 'W'
      if (middleUp && ringUp && pinkyUp && getDist(thumbTip, indexTip) < palmLength * 0.3) return 'F'
      break

    case 4:
      return 'B'
  }

  if (!indexUp && indexTip.y > indexPIP.y && indexPIP.y < indexBase.y && !middleUp && !ringUp && !pinkyUp) return 'X'
  return null
},

    // --- UTILS ---
    handleResize() {
      const canvas = this.$refs.canvasElement
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    },

    async startCamera() {
      const video = this.$refs.videoElement
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        video.srcObject = this.stream
        video.onloadedmetadata = () => {
          video.play()
          this.setupHands()
        }
      } catch (err) {
        alert(err.message)
      }
    },

    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
        this.stream = null
      }
      const video = this.$refs.videoElement
      if (video) {
        video.pause()
        video.srcObject = null
      }
      this.camera = null
    },

    async toavatar() {
      this.stopCamera()
      await this.$nextTick()
      this.$router.push({ name: 'avatar' })
    },

    async goBack() {
      this.stopCamera()
      await this.$nextTick()
      this.$router.push({ name: 'WillyHome' })
    },

    addSpace() {
      if (this.currentWord) {
        this.currentSentence += this.currentWord + ' '
        this.currentWord = ''
        this.candidateLetters = []
      }
    },
    cancelLetter() {
      this.currentWord = this.currentWord.slice(0, -1)
    },
    clearAll() {
      this.currentWord = ''
      this.currentSentence = ''
      this.candidateLetters = []
    },
  },
}
</script>
<style scoped>
.video-page {
  position: fixed;
  inset: 0;
  background: #1a1a1a;
  display: flex;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}
canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  transform: scaleX(-1);
}

.sidebar-right {
  position: fixed;
  right: 0;
  top: 0;
  width: 220px;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 20px;
  border-left: 1px solid #5dade2;
  z-index: 100;
}

.badge-container {
  position: relative;
  margin-top: 80px;
}
.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 12px;
}

.output-text {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0, 0, 0, 0.85);
  padding: 20px 40px;
  border-radius: 15px;
  border: 2px solid #5dade2;
  text-align: center;
}

.suggested span {
  color: #e3a81f;
  font-weight: bold;
  font-size: 32px;
}
.controls {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}
button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #5dade2;
  color: white;
  font-weight: bold;
}
.clear-btn {
  background: #e74c3c;
}
.back-btn {
  position: fixed;
  border-radius: 20%;
  top: 120px;
  left: 5%;
  background: #e3a81f;
  height: 50px;
  color: #f1f1f1;
}
.badge-toggle-btn {
  position: fixed;
  top: 120px;
  right: 12%;
  width: auto;
  height: 50px;
  border-radius: 20%;
  background: #5dade2;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
</style>
