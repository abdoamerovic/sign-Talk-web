<template>
  <section class="contianer">
    <section class="cont_info">
      <h1 class="kol">👑</h1>
      <h1>our premium services</h1>
      <p>speak.translate.connect</p>
    </section>

    <section class="cont_card">
      <div class="video_trans">
        <img src="@/assets/images/translate.jpg" />
        <h3>Video Translation</h3>
        <p>Instant translation of sign language into readable text in real-time.</p>
        <button @click="goVideo">Let's Translate</button>
      </div>

      <div class="dictionary">
        <img src="@/assets/images/dec.png" />
        <h3>Dictionary</h3>
        <p>Explore sign meanings and learn how each gesture represents letters and words.</p>
        <button @click="goDictionary">Learn More</button>
      </div>

      <div class="tosign">
        <img src="@/assets/images/quiz.jpg" />
        <h3>Text to video</h3>
        <p>Convert written text into explaining video</p>
        <button @click="goText">Convert Now</button>
      </div>

      <div class="chat_ai">
        <img src="@/assets/images/quiz.jpg" />
        <h3>AI Chat</h3>
        <p>Smart assistant for sign language communication.</p>
        <button @click="goAI">Lets understand</button>
      </div>
      <div class="c_w_s">
        <img src="@/assets/images/quiz.jpg" alt="Support Icon" />
        <h3>Human Support</h3>
        <p>
          Connect with a real sign language supporter.<br />
          Coming Soon...
        </p>
        <button disabled>Coming Soon</button>
      </div>
    </section>

    <div class="finshing">
      <h1>thats which we are provide now</h1>
      <h2>wait more ...</h2>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'ServiceS',
  setup() {
    const router = useRouter()
    const goDictionary = () => {
      router.push({ name: 'dec' })
    }
    const goVideo = () => {
      router.push({ name: 'Video' })
      // Add your video translation navigation logic here
    }
    const goText = () => {
      router.push({ name: 'SomeVideo' })
    }
    const goAI = () => {
      router.push({ name: 'Chat' })
    }
    return {
      goDictionary,
      goVideo,
      goText,
      goAI,
    }
  },
}
</script>

<style scoped>
:root {
  --primary-color: #007bff; /* أزرق أساسي */
  --secondary-color: #00bfff; /* أزرق فاتح */
  --accent-color: #e3a81f; /* بنى فاتح */
  --bg-color: #ffffff; /* خلفية بيضاء */
  --text-color: #545454; /* نص داكن */
}
body {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: var(--text-color);
  font-family: Arial, sans-serif;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.contianer {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  min-height: 100vh;
  display: block;
}
.cont_info {
  max-width: 1200px;
  margin: 0 auto;
  padding: 140px 20px 80px;
  text-align: center;
  color: var(--bg-color);
}

.cont_info h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

.cont_info p {
  font-size: 22px;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}
.kol{font-size: 50px; /* كبره زي ما تحب */
  display: inline-block;
  transform: scale(1.7);}

.cont_info p::before,
.cont_info p::after {
  content: '';
  width: 180px;
  height: 4px;
  background: linear-gradient(to right, var(--accent-color), transparent);
  box-shadow:
    0 0 25px var(--accent-color),
    0 0 50px var(--accent-color);
  animation: glowFade 3s ease-in-out infinite alternate;
}

.cont_info p::before {
  background: linear-gradient(to left, var(--accent-color), transparent);
}

@keyframes glowFade {
  0% {
    box-shadow:
      0 0 40px var(--bg-color),
      0 0 80px var(--bg-color);
  }
  100% {
    box-shadow: 0 0 10px var(--accent-color);
  }
}
.cont_card {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.video_trans,
.dictionary,
.tosign,
.chat_ai,
.c_w_s {
  width: 320px;
  height: 300px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: var(--bg-color);
  color: var(--primary-color);
  font-size: 17px;
  border: 3px solid var(--accent-color);
  border-radius: 15px;
  padding: 20px;
}
.cont_card img {
  width: 70px;
  height: 70px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.cont_card button {
  width: 100%;

  margin-top: 15px;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.cont_card button:active {
  transform: scale(0.98);
}
.video_trans:hover,
.dictionary:hover,
.c_w_s:hover,
.chat_ai:hover,
.tosign:hover {
  transform: translateY(-10px);
  transition: transform 0.5s ease;
  background-color: var(--primary-color);
  color: var(--bg-color);
  opacity: 0.9;
}
.cont_card:has(.video_trans:hover, .dictionary:hover, .c_w_s:hover, .chat_ai:hover, .tosign)
  button {
  background-color: var(--bg-color);
  color: var(--primary-color);
  border: 2px solid var(--bg-color);
}
.return {
  width: 80px;
  height: 35px;
  padding: 5px 10px;
  background-color: var(--bg-color);
  border-radius: 8px;
  color: var(--primary-color);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 110px;
  left: 20px;
  z-index: 1000;
}
.return a {
  text-decoration: none;
  color: var(--primary-color);
  font-size: 19px;
  font-weight: bold;
}
.return a:hover {
  color: var(--accent-color);
  transition:
    background-color 0.6s,
    color 0.5s;
}

.cont_card {
  perspective: 1200px;
}
.video_trans,
.dictionary,
.tosign,
.c_w_s,
.chat_ai {
  transform-style: preserve-3d;
  transition:
    transform 0.6s ease,
    box-shadow 0.6s ease;
}
.video_trans:hover,
.dictionary:hover,
.c_w_s:hover,
.chat_ai:hover,
.tosign:hover {
  transform: rotateY(15deg) rotateX(10deg) translateY(-15px);
  box-shadow:
    0 25px 45px var(--bg-color),
    inset 0 0 25px var(--secondary-color);
}
.finshing {
  font-size: medium;
  margin-top: 4%;
  color: var(--bg-color);
  text-align: center;
  align-items: center;
}
@media (max-width: 430px) {
  .header nav a.active {
    display: none;
  }

  .header {
    width: 100%;
  }
  .header nav a {
    display: none;
    position: absolute;
    top: 60px;
    right: 10px;
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    flex-direction: column;
    width: 150px;
  }
  .burger {
    display: block;
    margin-left: 40%;
  }
  .header nav a.active {
    display: flex;
  }

  .side_manu {
    top: 50px;
    width: 160px;
    padding: 10px;
    gap: 10px;
  }
  .side_manu.active {
    right: 5px;
  }
  .side_manu a {
    font-size: 16px;
    padding: 8px 0;
  }
  .side_manu a:hover {
    background-color: var(--secondary-color);
    color: #fff;
  }
}
</style>
