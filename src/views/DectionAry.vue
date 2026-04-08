<template>
  <section class="dictionary-view">
    <MainNavbar />

    <div class="return">
      <router-link to="/ServiceS" class="back-link">← Back </router-link>
    </div>

    <section class="bar">
      <div
        class="nav_tab"
        @click="activeTab = 1"
        :style="{ color: activeTab === 1 ? '#e3a81f' : '#007bff' }"
      >
        <h1>Learn Vocab</h1>
        <div v-if="activeTab === 1" class="underline"></div>
      </div>

      <div
        class="nav_tab"
        @click="activeTab = 2"
        :style="{ color: activeTab === 2 ? '#e3a81f' : '#007bff' }"
      >
        <h1>Some Words</h1>
        <div v-if="activeTab === 2" class="underline"></div>
      </div>
    </section>

    <div v-if="activeTab === 2 && selectedWord" class="selection-banner">
      <p>
        Currently viewing: <span>{{ selectedWord }}</span>
      </p>
    </div>

    <section v-if="activeTab === 1" class="contant">
      <div v-for="letter in alphabet" :key="letter.letter" class="card">
        <img :src="letter.img" :alt="'ASL Sign for ' + letter.letter" />
        <h2>Alphabet {{ letter.letter }}</h2>
      </div>
    </section>

    <section v-if="activeTab === 2" class="contant_2">
      <div
        v-for="(word, index) in words"
        :key="index"
        class="card_2_container"
        @click="selectedWord = word.text"
      >
        <div
          class="card_2_inner"
          :class="{ 'is-flipped': flippedWord === word.text }"
        >
          <div class="card-front" :class="{ 'active-card': selectedWord === word.text }">
            <img :src="word.img" :alt="word.text" />
            <h2>{{ word.text }}</h2>
            <div class="card-actions">
              <button class="btn-details" @click.stop="toggleFlip(word.text)">Details</button>
            </div>
          </div>

          <div class="card-back">
            <h2>{{ word.text }}</h2>
            <div class="state-message">
              <p>🟢 <strong>State: Active</strong></p>
              <p>Practice this ASL sign to master it!</p>
            </div>
            <div class="card-actions">
              <button class="btn-return" @click.stop="toggleFlip('')">↩ Return</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { ref } from 'vue'
import MainNavbar from '@/components/MainNavbar.vue'
import '@/assets/css/connect.css'

export default {
  name: 'DectionAry',
  components: {
    MainNavbar,
  },
  setup() {
    // UI State
    const activeTab = ref(1) // 1 = Alphabet, 2 = Words
    const selectedWord = ref('')
    const flippedWord = ref('') // Tracks which card is currently flipped
    const isOpen = ref(false)

    const goBack = () => {
      window.history.back()
    }

    // Toggle the flip animation
    const toggleFlip = (text) => {
      // If the clicked card is already flipped, unflip it by setting to empty string
      flippedWord.value = flippedWord.value === text ? '' : text
    }

    const playAudio = (audioPath) => {
      if (audioPath) {
        // Add your audio logic here
        console.log(`Playing ${audioPath}`)
      } else {
        alert("No audio available for this word.")
      }
    }

    // Alphabet Data with Vite Asset Handling
    const alphabet = [
      { letter: 'A', img: new URL('@/assets/images/ASL-A.jpg', import.meta.url).href },
      { letter: 'B', img: new URL('@/assets/images/ASL-B.jpg', import.meta.url).href },
      { letter: 'C', img: new URL('@/assets/images/ASL-C.jpg', import.meta.url).href },
      { letter: 'D', img: new URL('@/assets/images/ASL-D.jpg', import.meta.url).href },
      { letter: 'E', img: new URL('@/assets/images/ASL-E.jpg', import.meta.url).href },
      { letter: 'F', img: new URL('@/assets/images/ASL-F.jpg', import.meta.url).href },
      { letter: 'G', img: new URL('@/assets/images/ASL-G.jpg', import.meta.url).href },
      { letter: 'H', img: new URL('@/assets/images/ASL-H.jpg', import.meta.url).href },
      { letter: 'I', img: new URL('@/assets/images/ASL-I.jpg', import.meta.url).href },
      { letter: 'J', img: new URL('@/assets/images/ASL-J-line.jpg', import.meta.url).href },
      { letter: 'K', img: new URL('@/assets/images/ASL-K.jpg', import.meta.url).href },
      { letter: 'L', img: new URL('@/assets/images/ASL-L.jpg', import.meta.url).href },
      { letter: 'M', img: new URL('@/assets/images/ASL-M.jpg', import.meta.url).href },
      { letter: 'N', img: new URL('@/assets/images/ASL-N.jpg', import.meta.url).href },
      { letter: 'O', img: new URL('@/assets/images/ASL-O.jpg', import.meta.url).href },
      { letter: 'P', img: new URL('@/assets/images/ASL-P.jpg', import.meta.url).href },
      { letter: 'Q', img: new URL('@/assets/images/ASL-Q.jpg', import.meta.url).href },
      { letter: 'R', img: new URL('@/assets/images/ASL-R.jpg', import.meta.url).href },
      { letter: 'S', img: new URL('@/assets/images/ASL-S.jpg', import.meta.url).href },
      { letter: 'T', img: new URL('@/assets/images/ASL-T.jpg', import.meta.url).href },
      { letter: 'U', img: new URL('@/assets/images/ASL-U.jpg', import.meta.url).href },
      { letter: 'V', img: new URL('@/assets/images/ASL-V.jpg', import.meta.url).href },
      { letter: 'W', img: new URL('@/assets/images/ASL-W.jpg', import.meta.url).href },
      { letter: 'X', img: new URL('@/assets/images/ASL-X.jpg', import.meta.url).href },
      { letter: 'Y', img: new URL('@/assets/images/ASL-Y.jpg', import.meta.url).href },
      { letter: 'Z', img: new URL('@/assets/images/ASL-Z-line.jpg', import.meta.url).href },
    ]

    // Words Data
    const words = [
      { text: 'hello', img: new URL('@/assets/images/hello.jpg', import.meta.url).href },
      { text: 'thank you', img: new URL('@/assets/images/thankyou.webp', import.meta.url).href },
      { text: 'please', img: new URL('@/assets/images/please.webp', import.meta.url).href },
      { text: 'sorry', img: new URL('@/assets/images/sorry.webp', import.meta.url).href },
      { text: 'goodbye', img: new URL('@/assets/images/goodbye.webp', import.meta.url).href },
      { text: 'yes', img: new URL('@/assets/images/yes.webp', import.meta.url).href },
      { text: 'no', img: new URL('@/assets/images/no.gif', import.meta.url).href, audio: 'no.mp3' },
      { text: 'family', img: new URL('@/assets/images/family.webp', import.meta.url).href },
      { text: 'happy', img: new URL('@/assets/images/happy.webp', import.meta.url).href },
      { text: 'dont wait', img: new URL('@/assets/images/dontwait.webp', import.meta.url).href },
      { text: 'today', img: new URL('@/assets/images/today.webp', import.meta.url).href },
      { text: 'science', img: new URL('@/assets/images/science.png', import.meta.url).href },
    ]

    return {
      activeTab,
      selectedWord,
      flippedWord,
      isOpen,
      alphabet,
      words,
      toggleFlip,
      playAudio,
      goBack,
    }
  },
}
</script>

<style scoped>
/* Tabs Navigation */
.bar {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin: 70px 0;
  min-height: 60px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgb(255, 204, 0);
  width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.nav_tab {
  cursor: pointer;
  text-align: center;
}

.nav_tab h1 {
  font-size: 1.5rem;
  margin-bottom: 5px;
  transition: color 0.3s ease;
}

.underline {
  height: 3px;
  background-color: #e3a81f;
  width: 100%;
  border-radius: 2px;
}

/* Return Section */
.return {
  position: fixed;
  top: 90px;
  left: 20px;
  z-index: 1000;
  background-color: var(--bg-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: var(--primary-color);
  widows: auto;
}
.back-link {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  width: 100%;
  display: block;
}
.back-link:hover {
  color: #e3a81f;
}

/* Selection Banner */
.selection-banner {
  background: #f8f9fa;
  padding: 10px;
  text-align: center;
  margin: 10px 20px;
  border-radius: 8px;
  border-left: 5px solid #e3a81f;
}
.selection-banner span {
  font-weight: bold;
  color: #e3a81f;
  text-transform: uppercase;
}

/* Grids */
.contant,
.contant_2 {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: center;
}

/* --- Original Card (Alphabet Tab) --- */
.card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 180px;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgb(0, 140, 255);
  transition: all 0.3s ease;
}
.card img {
  width: 100%;
  height: 140px;
  object-fit: contain;
  border-radius: 8px;
}

/* --- 3D Flip Card Styles (Words Tab) --- */
.card_2_container {
  background-color: transparent;
  width: 180px;
  height: 290px; /* Fixed height is important for 3D flips */
  perspective: 1000px; /* Gives the 3D depth effect */
  cursor: pointer;
}

.card_2_inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

/* This class triggers the flip */
.is-flipped {
  transform: rotateY(180deg);
}

/* Common styling for both sides of the card */
.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari support */
  backface-visibility: hidden; /* Hides the back when looking at the front */
  border-radius: 12px;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Front Styling */
.card-front {
  background-color: white;
}
.card-front:hover {
  box-shadow: 0 8px 20px rgb(0, 140, 255);
  transition: box-shadow 0.3s ease;
}
.card-front img {
  width: 100%;
  height: 140px;
  object-fit: contain;
  border-radius: 8px;
}

/* Back Styling */
.card-back {
  background-color: #f8f9fa;
  transform: rotateY(180deg); /* Start rotated backwards */
  border: 2px solid #e3a81f;
  justify-content: center;
  gap: 15px;
}
.card-back h2 {
  color: #e3a81f;
  margin-top: 0;
}
.state-message p {
  font-size: 0.95rem;
  margin: 5px 0;
  color: #333;
}

.active-card {
  border: 2px solid #e3a81f;
}

/* Buttons */
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

button {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

button:hover {
  background: #007bff;
  color: white;
}
.btn-return {
  border-color: #e3a81f;
  color: #e3a81f;
}
.btn-return:hover {
  background: #e3a81f;
  color: white;
}
</style>
