<template>
  <div class="video-page">
    <video ref="videoElement" autoplay playsinline muted></video>
    <canvas ref="canvasElement"></canvas>

    <!-- Ring Progress Overlay -->
    <div class="ring-overlay" v-if="candidateLetters.length > 0">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle
          cx="45"
          cy="45"
          r="34"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          stroke-width="6"
        />
        <circle
          cx="45"
          cy="45"
          r="34"
          fill="none"
          stroke="#00ffcc"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="ringOffset"
          transform="rotate(-90 45 45)"
          style="transition: stroke-dashoffset 0.1s linear"
        />
        <text x="45" y="52" text-anchor="middle" fill="white" font-size="22" font-weight="bold">
          {{ lastLetter }}
        </text>
      </svg>
    </div>

    <button class="btn-nav btn-services" @click="goBack">⬅ Back</button>

    <button class="btn-nav btn-sign" @click="toAvatar">✋ For Sign</button>

    <div class="output-panel">
      <div class="section" v-if="candidateLetters.length > 0">
        <span class="section-label">Detected:</span>
        <div class="btn-row">
          <button
            v-for="letter in candidateLetters"
            :key="letter"
            @click="addLetter(letter)"
            class="btn-letter"
            :class="{ primary: letter === candidateLetters[0] }"
          >
            {{ letter }}
          </button>
        </div>
      </div>

      <div class="section" v-if="predictedWords.length > 0">
        <span class="section-label">Words:</span>
        <div class="btn-row">
          <button
            v-for="word in predictedWords"
            :key="word"
            @click="acceptPrediction(word)"
            class="btn-word"
          >
            {{ word }}
          </button>
        </div>
      </div>

      <div class="text-display">
        <div class="text-row">
          <span class="text-label">Word</span>
          <span class="text-value word-val">{{ currentWord || '—' }}</span>
        </div>
        <div class="text-row">
          <span class="text-label">Sentence</span>
          <span class="text-value sentence-val">{{ currentSentence || '—' }}</span>
        </div>
      </div>

      <div class="controls">
        <button @click="addWordToSentence" class="btn-ctrl btn-space">✓ Word</button>
        <button @click="cancelLetter" class="btn-ctrl btn-delete">⌫ Letter</button>
        <button @click="clearAll" class="btn-ctrl btn-clear">✕ All</button>
        <button @click="speak" class="btn-ctrl btn-speak" :class="{ speaking: isSpeaking }">
          {{ isSpeaking ? '🔊 Speaking…' : '🔊 Speak' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Hands } from '@mediapipe/hands'

export default {
  name: 'VideoCall',

  data() {
    return {
      stream: null,
      currentWord: '',
      currentSentence: '',
      isSpeaking: false,
      candidateLetters: [],
      lastLetter: '',
      stabilityCount: 0,
      stabilityThreshold: 20,
      autoSelectTimer: null,
      autoSelectDelay: 2000,
      lastAddedLetter: '',
      cooldown: false,
      confidenceCounter: {},
      confidenceThreshold: 6,
      ringProgress: 0,
      ringInterval: null,
      wordDictionary: [
        'A LOT',
        'APPLE',
        'AWESOME',
        'BAD',
        'BOY',
        'BEAUTIFUL',
        'CAT',
        'CAR',
        'COOL',
        'DOG',
        'DAD',
        'DAY',
        'EAT',
        'EASY',
        'EVERY',
        'FOOD',
        'FRIEND',
        'FAMILY',
        'GOOD',
        'GIRL',
        'GREAT',
        'HELLO',
        'HELP',
        'HOME',
        'HOW',
        'HAPPY',
        'I',
        'ICE',
        'IDEA',
        'JUMP',
        'JOKE',
        'JUST',
        'KNOW',
        'KEEP',
        'KIND',
        'LOVE',
        'LIKE',
        'LITTLE',
        'MOM',
        'MORE',
        'MANY',
        'NO',
        'NAME',
        'NICE',
        'PLEASE',
        'PLAY',
        'PEOPLE',
        'QUIT',
        'QUICK',
        'QUESTION',
        'RIGHT',
        'READ',
        'READY',
        'SORRY',
        'SOME',
        'SCHOOL',
        'THANK YOU',
        'TIME',
        'TODAY',
        'WATER',
        'WORK',
        'WANT',
        'YES',
        'YOU',
        'YOUR',
        'ZEBRA',
        'ZERO',
      ],
    }
  },

  computed: {
    predictedWords() {
      if (!this.currentWord) return []
      const search = this.currentWord.toUpperCase()
      return this.wordDictionary
        .filter((w) => w.startsWith(search))
        .sort((a, b) => a.length - b.length)
        .slice(0, 6)
    },
    circumference() {
      return 2 * Math.PI * 34
    },
    ringOffset() {
      return this.circumference - (this.circumference * this.ringProgress) / 100
    },
  },

  async mounted() {
    await this.$nextTick()
    await this.startCamera()
  },

  beforeUnmount() {
    this.stopCamera()
    this.clearRingInterval()
  },

  methods: {
    // ── Letter / Word Management ──────────────────────────────────────────────
    addLetter(letter) {
      if (this.cooldown) return
      this.currentWord += letter
      this.lastAddedLetter = letter
      this.candidateLetters = []
      this.stabilityCount = 0
      this.confidenceCounter = {}
      this.ringProgress = 0
      this.clearRingInterval()
      this.clearAutoSelectTimer()
      this.cooldown = true
      setTimeout(() => {
        this.cooldown = false
      }, 1500)
    },

    cancelLetter() {
      this.currentWord = this.currentWord.slice(0, -1)
    },

    acceptPrediction(word) {
      this.currentWord = word
    },

    addWordToSentence() {
      const trimmed = this.currentWord.trim()
      if (!trimmed) return
      this.currentSentence = (this.currentSentence + ' ' + trimmed).trim()
      this.currentWord = ''
    },

    clearAll() {
      this.currentWord = ''
      this.currentSentence = ''
      this.candidateLetters = []
      this.stabilityCount = 0
      this.confidenceCounter = {}
      this.ringProgress = 0
      this.clearRingInterval()
      this.clearAutoSelectTimer()
      window.speechSynthesis.cancel()
      this.isSpeaking = false
    },

    // ── Speech ────────────────────────────────────────────────────────────────
    speak() {
      const text = this.currentSentence.trim()
      if (!text || this.isSpeaking) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.95
      u.pitch = 1
      u.lang = 'en-US'
      u.onstart = () => {
        this.isSpeaking = true
      }
      u.onend = () => {
        this.isSpeaking = false
      }
      u.onerror = () => {
        this.isSpeaking = false
      }
      window.speechSynthesis.speak(u)
    },

    // ── Navigation ────────────────────────────────────────────────────────────
    async goBack() {
      await this.stopCamera()
      this.$router.back()
    },

    async toAvatar() {
      await this.stopCamera()
      this.$router.push({ name: 'Avatar' })
    },

    // ── Ring Progress ─────────────────────────────────────────────────────────
    clearRingInterval() {
      if (this.ringInterval) {
        clearInterval(this.ringInterval)
        this.ringInterval = null
      }
    },
    clearAutoSelectTimer() {
      if (this.autoSelectTimer) {
        clearTimeout(this.autoSelectTimer)
        this.autoSelectTimer = null
      }
    },

    startRingProgress(duration) {
      this.ringProgress = 0
      this.clearRingInterval()
      const steps = 60,
        increment = 100 / steps,
        interval = duration / steps
      this.ringInterval = setInterval(() => {
        this.ringProgress = Math.min(this.ringProgress + increment, 100)
        if (this.ringProgress >= 100) this.clearRingInterval()
      }, interval)
    },

    // ── Camera & MediaPipe ────────────────────────────────────────────────────
    async startCamera() {
      const video = this.$refs.videoElement
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true })
        video.srcObject = this.stream
        video.onloadedmetadata = () => {
          video.play()
          this.setupHands()
        }
      } catch (err) {
        alert('Camera error: ' + err.message)
      }
    },

    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((t) => t.stop())
        this.stream = null
      }
      if (this.$refs.video) {
        this.$refs.video.srcObject = null
      }
      window.speechSynthesis.cancel()
    },
    setupHands() {
      const video = this.$refs.videoElement
      const canvas = this.$refs.canvasElement
      const ctx = canvas.getContext('2d')

      const hands = new Hands({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      })
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      })

      hands.onResults((results) => {
        canvas.width = video.videoWidth || canvas.offsetWidth
        canvas.height = video.videoHeight || canvas.offsetHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (results.multiHandLandmarks?.length > 0) {
          const lm = results.multiHandLandmarks[0]
          this.drawConnections(ctx, lm, canvas)
          this.drawLandmarks(ctx, lm, canvas)
          this.processLandmarks(lm)
        } else {
          this.resetDetection()
        }
      })

      const processFrame = async () => {
        if (!this.stream) return
        await hands.send({ image: video })
        requestAnimationFrame(processFrame)
      }
      processFrame()
    },

    drawLandmarks(ctx, lm, canvas) {
      lm.forEach((p, idx) => {
        ctx.beginPath()
        ctx.arc(p.x * canvas.width, p.y * canvas.height, idx === 0 ? 8 : 5, 0, 2 * Math.PI)
        ctx.fillStyle = idx === 0 ? '#ff6b6b' : '#00ffcc'
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      })
    },

    drawConnections(ctx, lm, canvas) {
      const connections = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8],
        [0, 9],
        [9, 10],
        [10, 11],
        [11, 12],
        [0, 13],
        [13, 14],
        [14, 15],
        [15, 16],
        [0, 17],
        [17, 18],
        [18, 19],
        [19, 20],
        [5, 9],
        [9, 13],
        [13, 17],
      ]
      ctx.strokeStyle = 'rgba(0,255,204,0.4)'
      ctx.lineWidth = 2
      connections.forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(lm[a].x * canvas.width, lm[a].y * canvas.height)
        ctx.lineTo(lm[b].x * canvas.width, lm[b].y * canvas.height)
        ctx.stroke()
      })
    },

    processLandmarks(lm) {
      const candidates = this.getLetterCandidates(lm)
      const top = candidates[0]
      if (!top) return
      this.confidenceCounter[top] = (this.confidenceCounter[top] || 0) + 1
      if (top === this.lastLetter) {
        this.stabilityCount++
      } else {
        this.stabilityCount = 1
        this.lastLetter = top
        this.confidenceCounter = { [top]: 1 }
        this.ringProgress = 0
        this.clearRingInterval()
        this.clearAutoSelectTimer()
      }
      if (
        this.stabilityCount > this.stabilityThreshold &&
        (this.confidenceCounter[top] || 0) > this.confidenceThreshold
      ) {
        this.candidateLetters = candidates
        if (top === this.lastAddedLetter) return
        if (!this.autoSelectTimer) {
          this.startRingProgress(this.autoSelectDelay)
          this.autoSelectTimer = setTimeout(() => {
            if (!this.cooldown) this.addLetter(top)
          }, this.autoSelectDelay)
        }
      }
    },

    resetDetection() {
      this.candidateLetters = []
      this.stabilityCount = 0
      this.ringProgress = 0
      this.clearRingInterval()
      this.clearAutoSelectTimer()
    },
    getLetterCandidates(lm) {
      if (!lm || lm.length < 21) return []

      const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
      const wrist = lm[0]
      const palm = dist(wrist, lm[9])

      // ── Finger extended ───────────────────────────────────────────────────
      const isUp = (tip, pip) => dist(lm[tip], wrist) > dist(lm[pip], wrist) + palm * 0.12
      const indexUp = isUp(8, 6)
      const middleUp = isUp(12, 10)
      const ringUp = isUp(16, 14)
      const pinkyUp = isUp(20, 18)
      const allFingersDown = !indexUp && !middleUp && !ringUp && !pinkyUp

      // ── Thumb extended sideways (for A, L, Y) ────────────────────────────
      const thumbOut = dist(lm[4], lm[17]) > palm * 0.65

      // ── Key distances ─────────────────────────────────────────────────────
      const thumbIndexDist = dist(lm[4], lm[8])
      const thumbMiddleDist = dist(lm[4], lm[12])
      const indexMiddleDist = dist(lm[8], lm[12])
      const middleRingDist = dist(lm[12], lm[16])
      const indexRingDist = dist(lm[8], lm[16])

      // ── Finger direction vectors (MCP → tip) ─────────────────────────────
      const indexVec = { x: lm[8].x - lm[5].x, y: lm[8].y - lm[5].y }
      const middleVec = { x: lm[12].x - lm[9].x, y: lm[12].y - lm[9].y }
      const indexHorizontal = Math.abs(indexVec.x) > Math.abs(indexVec.y) * 1.1
      const middleHorizontal = Math.abs(middleVec.x) > Math.abs(middleVec.y) * 1.1
      const fingersPointSideways = indexHorizontal && middleHorizontal

      // ── Index+tip pointing downward (for Q, P) ───────────────────────────
      const indexPointsDown = lm[8].y > wrist.y + palm * 0.1
      const thumbPointsDown = lm[4].y > wrist.y + palm * 0.1
      const isHandPointingDown = lm[9].y < wrist.y - palm * 0.15

      // ── R: tips CLOSER than PIPs = crossed ───────────────────────────────
      const fingersCrossed =
        indexUp &&
        middleUp &&
        indexMiddleDist < palm * 0.15 &&
        dist(lm[8], lm[12]) < dist(lm[7], lm[11])

      // ── Spread checks ─────────────────────────────────────────────────────
      const fingersSpread = indexMiddleDist > palm * 0.28
      const threeFingerSpread = indexRingDist > palm * 0.35 && middleRingDist > palm * 0.14

      // ── X: index hooked ──────────────────────────────────────────────────
      const indexHooked =
        !indexUp &&
        dist(lm[8], lm[5]) > palm * 0.15 &&
        dist(lm[8], lm[5]) < palm * 0.35 &&
        dist(lm[8], lm[6]) < dist(lm[7], lm[6])

      // ── T: thumb tip between index MCP and middle MCP ────────────────────
      const minMCP_x = Math.min(lm[5].x, lm[9].x)
      const maxMCP_x = Math.max(lm[5].x, lm[9].x)
      const thumbTipBetweenMCPs =
        lm[4].x > minMCP_x - palm * 0.08 && lm[4].x < maxMCP_x + palm * 0.08
      const thumbPeeksOut = lm[4].y <= lm[6].y + palm * 0.15
      const isTGesture = allFingersDown && thumbTipBetweenMCPs && thumbPeeksOut

      // ── M/N: fingers folded OVER thumb ───────────────────────────────────
      const minFingerMCP_x = Math.min(lm[5].x, lm[9].x, lm[13].x)
      const maxFingerMCP_x = Math.max(lm[5].x, lm[9].x, lm[13].x)
      const thumbUnderFingers =
        allFingersDown &&
        !thumbOut &&
        lm[4].x > minFingerMCP_x - palm * 0.1 &&
        lm[4].x < maxFingerMCP_x + palm * 0.1 &&
        dist(lm[4], lm[6]) < palm * 0.32

      // ── C: open curve ────────────────────────────────────────────────────
      const isOpenCurve =
        !indexUp &&
        !middleUp &&
        !ringUp &&
        !pinkyUp &&
        dist(lm[8], wrist) > palm * 0.52 &&
        thumbIndexDist > palm * 0.28 &&
        thumbIndexDist < palm * 0.62

      const thumbNearIndexTip = thumbIndexDist < palm * 0.35

      // ── K: thumb between index+middle tips ───────────────────────────────
      const isKThumb = thumbIndexDist < palm * 0.5 && thumbMiddleDist < palm * 0.55 && !thumbOut

      // ── S: thumb at mid-knuckle level ────────────────────────────────────
      const thumbAtMidKnuckle =
        allFingersDown &&
        !thumbOut &&
        !thumbTipBetweenMCPs &&
        dist(lm[4], lm[8]) < palm * 0.45 &&
        lm[4].y < lm[5].y &&
        lm[4].y > lm[8].y - palm * 0.1

      // ── E: each fingertip close to its own MCP = properly bent/hooked ────
      // This approach measures bend directly — works even if isUp is ambiguous
      const eIndex = dist(lm[8], lm[5]) < palm * 0.58
      const eMiddle = dist(lm[12], lm[9]) < palm * 0.58
      const eRing = dist(lm[16], lm[13]) < palm * 0.6
      const ePinky = dist(lm[20], lm[17]) < palm * 0.62
      const eThumbTucked =
        !thumbOut &&
        thumbIndexDist < palm * 0.55 &&
        dist(lm[4], lm[9]) < palm * 0.65 &&
        dist(lm[4], lm[5]) < palm * 0.55
      const isEGesture =
        eIndex && eMiddle && eRing && ePinky && eThumbTucked && !isTGesture && !thumbUnderFingers

      // ── Scoring ───────────────────────────────────────────────────────────
      const scores = {}
      const add = (letter, score) => {
        scores[letter] = (scores[letter] || 0) + score
      }

      // ── E: highest priority — return immediately ──────────────────────────
      if (isEGesture) {
        add('E', 15)
        return ['E']
      }

      // ── A ─────────────────────────────────────────────────────────────────
      if (allFingersDown && thumbOut) add('A', 7)

      // ── B ─────────────────────────────────────────────────────────────────
      if (indexUp && middleUp && ringUp && pinkyUp && !thumbOut) add('B', 8)
      if (indexUp && middleUp && ringUp && pinkyUp) add('B', 2)

      // ── C ─────────────────────────────────────────────────────────────────
      const isC =
        isOpenCurve &&
        !thumbNearIndexTip &&
        thumbIndexDist > palm * 0.32 &&
        thumbIndexDist < palm * 0.6 &&
        dist(lm[8], wrist) > palm * 0.5

      if (isC) add('C', 9)
      if (
        isOpenCurve &&
        thumbIndexDist > palm * 0.28 &&
        thumbIndexDist < palm * 0.65 &&
        dist(lm[8], wrist) > palm * 0.46 &&
        !thumbNearIndexTip
      )
        add('C', 3)

      // ── D ─────────────────────────────────────────────────────────────────
      if (indexUp && !middleUp && !ringUp && !pinkyUp && thumbMiddleDist < palm * 0.28) add('D', 8)
      if (indexUp && !middleUp && !ringUp && !pinkyUp && thumbMiddleDist < palm * 0.35) add('D', 3)

      // ── F ─────────────────────────────────────────────────────────────────
      if (!indexUp && middleUp && ringUp && pinkyUp && thumbIndexDist < palm * 0.22) add('F', 9)
      if (!indexUp && middleUp && ringUp && pinkyUp && thumbIndexDist < palm * 0.3) add('F', 3)

      // ── G ─────────────────────────────────────────────────────────────────
      if (indexUp && !middleUp && !ringUp && !pinkyUp && thumbOut && indexHorizontal) add('G', 8)
      if (indexUp && !middleUp && !ringUp && !pinkyUp && indexHorizontal) add('G', 3)

      // ── H ─────────────────────────────────────────────────────────────────
      if (
        indexUp &&
        middleUp &&
        !ringUp &&
        !pinkyUp &&
        fingersPointSideways &&
        indexMiddleDist < palm * 0.22
      )
        add('H', 9)
      if (indexUp && middleUp && !ringUp && !pinkyUp && fingersPointSideways) add('H', 4)

      // ── I ─────────────────────────────────────────────────────────────────
      if (!indexUp && !middleUp && !ringUp && pinkyUp && !thumbOut) add('I', 9)
      if (!indexUp && !middleUp && !ringUp && pinkyUp) add('I', 3)

      // ── J ─────────────────────────────────────────────────────────────────
      if (!indexUp && !middleUp && !ringUp && pinkyUp) add('J', 3)

      // ── K ─────────────────────────────────────────────────────────────────
      if (indexUp && middleUp && !ringUp && !pinkyUp && !fingersPointSideways && isKThumb)
        add('K', 9)
      if (indexUp && middleUp && !ringUp && !pinkyUp && thumbIndexDist < palm * 0.55 && !thumbOut)
        add('K', 3)

      // ── L ─────────────────────────────────────────────────────────────────
      if (indexUp && !middleUp && !ringUp && !pinkyUp && thumbOut && !indexHorizontal) add('L', 9)
      if (indexUp && !middleUp && !ringUp && !pinkyUp && thumbOut) add('L', 3)

      // ── M ─────────────────────────────────────────────────────────────────
      if (
        thumbUnderFingers &&
        dist(lm[8], wrist) < palm * 0.72 &&
        dist(lm[12], wrist) < palm * 0.72 &&
        dist(lm[16], wrist) < palm * 0.74
      )
        add('M', 9)
      if (thumbUnderFingers && dist(lm[16], wrist) < palm * 0.78) add('M', 3)

      // ── N ─────────────────────────────────────────────────────────────────
      if (
        thumbUnderFingers &&
        dist(lm[8], wrist) < palm * 0.72 &&
        dist(lm[12], wrist) < palm * 0.72 &&
        dist(lm[16], wrist) > palm * 0.6
      )
        add('N', 9)
      if (thumbUnderFingers && dist(lm[16], wrist) > palm * 0.58) add('N', 3)

      // ── O ─────────────────────────────────────────────────────────────────
      if (
        allFingersDown &&
        thumbIndexDist < palm * 0.2 &&
        dist(lm[8], wrist) > palm * 0.4 &&
        !thumbTipBetweenMCPs
      )
        add('O', 10)
      if (
        allFingersDown &&
        thumbIndexDist < palm * 0.26 &&
        dist(lm[8], wrist) > palm * 0.34 &&
        !thumbTipBetweenMCPs
      )
        add('O', 4)

      // ── P ─────────────────────────────────────────────────────────────────
      if (
        indexUp &&
        middleUp &&
        !ringUp &&
        !pinkyUp &&
        thumbOut &&
        isHandPointingDown &&
        lm[8].y > wrist.y - palm * 0.05
      )
        add('P', 8)

      // ── Q ─────────────────────────────────────────────────────────────────
      if (
        indexUp &&
        !middleUp &&
        !ringUp &&
        !pinkyUp &&
        thumbOut &&
        indexPointsDown &&
        thumbPointsDown
      )
        add('Q', 9)
      if (
        indexUp &&
        !middleUp &&
        !ringUp &&
        !pinkyUp &&
        (indexPointsDown || thumbPointsDown) &&
        thumbOut
      )
        add('Q', 4)

      // ── R ─────────────────────────────────────────────────────────────────
      if (fingersCrossed && !ringUp && !pinkyUp) add('R', 10)
      if (
        indexUp &&
        middleUp &&
        !ringUp &&
        !pinkyUp &&
        indexMiddleDist < palm * 0.14 &&
        !fingersCrossed
      )
        add('R', 3)

      // ── S ─────────────────────────────────────────────────────────────────
      if (thumbAtMidKnuckle && !isTGesture && !thumbUnderFingers) add('S', 8)

      // ── T ─────────────────────────────────────────────────────────────────
      if (isTGesture) add('T', 11)
      if (allFingersDown && thumbTipBetweenMCPs && !thumbPeeksOut) add('T', 5)

      // ── U ─────────────────────────────────────────────────────────────────
      if (
        indexUp &&
        middleUp &&
        !ringUp &&
        !pinkyUp &&
        !fingersCrossed &&
        !fingersSpread &&
        !fingersPointSideways &&
        indexMiddleDist < palm * 0.22 &&
        !isHandPointingDown &&
        lm[8].y < wrist.y
      )
        add('U', 8)

      // ── V ─────────────────────────────────────────────────────────────────
      if (
        indexUp &&
        middleUp &&
        !ringUp &&
        !pinkyUp &&
        fingersSpread &&
        !fingersCrossed &&
        !fingersPointSideways
      )
        add('V', 9)
      if (indexUp && middleUp && !ringUp && fingersSpread) add('V', 3)

      // ── W ─────────────────────────────────────────────────────────────────
      if (indexUp && middleUp && ringUp && !pinkyUp && threeFingerSpread) add('W', 8)
      if (indexUp && middleUp && ringUp && !pinkyUp) add('W', 3)

      // ── X ─────────────────────────────────────────────────────────────────
      if (indexHooked && !middleUp && !ringUp && !pinkyUp) {
        if (dist(lm[4], lm[9]) > palm * 0.45) add('X', 10)
        else add('X', 5)
      }
      if (
        !indexUp &&
        !middleUp &&
        !ringUp &&
        !pinkyUp &&
        dist(lm[8], lm[5]) > palm * 0.16 &&
        dist(lm[8], lm[5]) < palm * 0.38
      )
        add('X', 3)

      // ── Y ─────────────────────────────────────────────────────────────────
      if (!indexUp && !middleUp && !ringUp && pinkyUp && thumbOut) add('Y', 10)
      if (pinkyUp && thumbOut && !indexUp && !middleUp && !ringUp) add('Y', 4)

      // ── Z ─────────────────────────────────────────────────────────────────
      if (
        indexUp &&
        !middleUp &&
        !ringUp &&
        !pinkyUp &&
        !indexHorizontal &&
        thumbIndexDist > palm * 0.45 &&
        dist(lm[4], lm[17]) > palm * 0.4 &&
        dist(lm[4], lm[17]) < palm * 0.65
      )
        add('Z', 6)

      // ── Sort and return top 4 ─────────────────────────────────────────────
      const sorted = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .map(([letter]) => letter)

      return sorted.slice(0, 4)
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Exo+2:wght@400;600&display=swap');

.video-page {
  position: fixed;
  inset: 0;
  background: #111318;
  font-family: 'Exo 2', sans-serif;
  overflow: hidden;
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

.ring-overlay {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  filter: drop-shadow(0 0 12px #00ffcc);
}

.btn-nav {
  position: fixed;
  top: 100px;
  z-index: 200;
  padding: 10px 18px;
  border: none;
  border-radius: 30px;
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition:
    transform 0.15s,
    opacity 0.15s;
}
.btn-nav {
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s ease;
  font-weight: 500;
}

/* زرار Services */
.btn-services {
  background: transparent;
  color: #00ffcc;
  border: 2px solid #00ffcc;
  left: 20px;
}

.btn-services:hover {
  background: #00ffcc;
  color: black;
}

/* زرار Sign */
.btn-sign {
  background: #00ffcc;
  color: black;
  right: 20px;
}

.btn-sign:hover {
  background: #00ccaa;
}
.btn-nav:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}
.btn-back {
  left: 20px;
  background: rgba(227, 168, 31, 0.85);
  color: #fff;
}
.btn-avatar {
  right: 20px;
  background: rgba(93, 173, 226, 0.85);
  color: #fff;
}

.output-panel {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(700px, 96vw);
  background: rgba(10, 12, 18, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(93, 173, 226, 0.4);
  border-bottom: none;
  border-radius: 20px 20px 0 0;
  padding: 18px 22px 22px;
  z-index: 100;
}

.section {
  margin-bottom: 12px;
}
.section-label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5dade2;
  margin-bottom: 6px;
}
.btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-letter {
  padding: 8px 16px;
  background: rgba(0, 255, 204, 0.12);
  border: 1.5px solid #00ffcc;
  border-radius: 8px;
  color: #00ffcc;
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.1s;
}
.btn-letter.primary {
  background: #00ffcc;
  color: #111;
}
.btn-letter:hover {
  background: rgba(0, 255, 204, 0.25);
  transform: scale(1.05);
}

.btn-word {
  padding: 7px 14px;
  background: rgba(227, 168, 31, 0.15);
  border: 1.5px solid #e3a81f;
  border-radius: 8px;
  color: #e3a81f;
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-word:hover {
  background: rgba(227, 168, 31, 0.3);
}

.text-display {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 14px;
}
.text-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}
.text-row:last-child {
  margin-bottom: 0;
}
.text-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  min-width: 60px;
}
.word-val {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.06em;
}
.sentence-val {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.5;
}

.controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn-ctrl {
  flex: 1;
  min-width: 80px;
  padding: 11px 10px;
  border: none;
  border-radius: 10px;
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition:
    opacity 0.15s,
    transform 0.1s;
}
.btn-ctrl:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}
.btn-space {
  background: #5dade2;
  color: #fff;
}
.btn-delete {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.btn-clear {
  background: #e74c3c;
  color: #fff;
}
.btn-speak {
  background: linear-gradient(135deg, #7c3aed, #5dade2);
  color: #fff;
}
.btn-speak.speaking {
  animation: pulse-speak 1s ease-in-out infinite;
}

@keyframes pulse-speak {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
