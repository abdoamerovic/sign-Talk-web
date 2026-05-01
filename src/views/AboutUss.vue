<template>
  <section class="about-page">
    <div class="return">
      <router-link to="/">← Home</router-link>
    </div>

    <div class="page-header">
      <h1>Breaking Barriers, Building Connections</h1>
    </div>

    <div class="info">
      <div class="info-text">
        <p>
          SignTalk was created with one clear goal: to make communication easier for everyone. We
          believe that language should never be a barrier between people. Our project helps
          individuals learn and understand sign language, enabling them to communicate naturally
          with the people they meet every day — in the street, at work, or in urgent situations.
        </p>
        <p>
          By combining learning tools with real-time translation, SignTalk provides a fast and
          direct way to connect, understand, and be understood. We are building a world where
          communication is simple, inclusive, and accessible to all.
        </p>

        <div class="quick-highlights">
          <div class="highlight">
            <span class="highlight-title">Community</span>
            <span class="highlight-value">12+ Users</span>
          </div>
          <div class="highlight">
            <span class="highlight-title">Languages</span>
            <span class="highlight-value">5+ Sign Types</span>
          </div>
        </div>
      </div>

      <div class="info-image">
        <img src="@/assets/images/aboutus.jpg" alt="About SignTalk" />
      </div>
    </div>

    <div class="stats-header">
      <h1 class="stats-title">Impact by the <span>Numbers</span></h1>
      <p class="stats-subtitle">
        Real-time metrics showcasing our commitment to accessible communication
      </p>
    </div>

    <section class="stats">
      <div class="stat-card">
        <span class="trend">+12%</span>
        <h2>{{ stats.activeUsers.toLocaleString() }}</h2>
        <h3>Active Users</h3>
        <p>Growing community</p>
      </div>

      <div class="stat-card">
        <span class="trend">+28%</span>
        <h2>{{ stats.serviceUsage.toLocaleString() }}</h2>
        <h3>Service Usage</h3>
        <p>Monthly translations</p>
      </div>

      <div class="stat-card">
        <span class="trend">+19%</span>
        <h2>{{ stats.signsTranslated.toLocaleString() }}</h2>
        <h3>Signs Translated</h3>
        <p>Successful conversations</p>
      </div>

      <div class="stat-card">
        <span class="trend">+2%</span>
        <h2>{{ stats.successRate }}%</h2>
        <h3>Success Rate</h3>
        <p>Accuracy guarantee</p>
      </div>
    </section>

    <section class="cta-section">
      <h2>Join Our Growing Community</h2>
      <p>Be part of the movement to make communication accessible to everyone, everywhere.</p>
      <router-link to="/signup" class="cta-button">Get Started Today</router-link>
    </section>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../assets/js/firebase'

export default {
  setup() {
    // Starts at 0 while waiting for Firebase to load the real numbers
    const stats = ref({
      activeUsers: 20,
      serviceUsage: 55,
      signsTranslated: 30,
      successRate: 10,
    })

    // Connects directly to your Firebase document
    const statsRef = doc(db, 'statistics', 'main_stats')

    onMounted(() => {
      // Listens for real-time updates from your database
      onSnapshot(statsRef, (docSnap) => {
        if (docSnap.exists()) {
          stats.value = docSnap.data()
        } else {
          console.error('Statistics document not found in Firebase database.')
        }
      })
    })

    return {
      stats,
    }
  },
}
</script>

<style scoped>
.about-page {
  margin-top: 80px;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 42px;
  background: linear-gradient(90deg, #fcd200, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.5px;
}

/* Info section */
.info {
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
}

.info-text {
  flex: 1;
  min-width: 300px;
  font-size: 17px;
  line-height: 1.8;
  color: #444;
}

.info-text p {
  margin-bottom: 20px;
}

/* Quick Highlights inside Info Text */
.quick-highlights {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.highlight {
  display: flex;
  flex-direction: column;
}

.highlight-title {
  font-size: 14px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

.highlight-value {
  font-size: 20px;
  color: #e3a81f;
  font-weight: bold;
}

.info-image img {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.info-image :hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
  box-shadow: 4px 4px 8px rgba(255, 221, 0, 0.888);
}

/* Statistics Header */
.stats-header {
  text-align: center;
  margin-top: 100px;
}

.stats-title {
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 10px;
}
.stats-title span {
  color: #e3a81f;
  font-weight: bold;
  font:
    40px 'Segoe UI',
    Tahoma,
    Geneva,
    Verdana,
    sans-serif;
}

.stats-subtitle {
  font-size: 16px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

/* Statistics Layout */
.stats {
  display: flex;
  justify-content: center;
  gap: 25px;
  flex-wrap: wrap;
  margin-top: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* Stat Cards */
.stat-card {
  width: 260px;
  padding: 30px 20px;
  background: white;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #f0f0f0;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 123, 255, 0.1);
  border-color: #007bff;
}

.trend {
  display: inline-block;
  background-color: #e6f4ea;
  color: #1e8e3e;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 15px;
}

.stat-card h2 {
  font-size: 42px;
  margin: 0 0 5px 0;
  color: #e3a81f;
  font-weight: 800;
}

.stat-card h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
}

.stat-card p {
  font-size: 14px;
  color: #777;
  margin: 0;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 60px 20px;
  margin: 100px auto 50px;
  background: linear-gradient(135deg, #007bff, #00bfff);
  border-radius: 20px;
  color: white;
  max-width: 1100px;
  box-shadow: 0 10px 30px rgba(0, 123, 255, 0.2);
  border: 1px solid #ffffff;
}

.cta-section h2 {
  font-size: 32px;
  margin-bottom: 15px;
}

.cta-section p {
  font-size: 18px;
  margin-bottom: 30px;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  background-color: #e3a81f;
  color: white;
  padding: 15px 35px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  border: 1px solid #ffffff;
}

.cta-button:hover {
  background-color: #c79218;
  transform: scale(1.05);
}

/* Return link */
.return {
  width: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 110px;
  left: 20px;
  z-index: 1000;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.return a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.return a:hover {
  color: #e3a81f;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 32px;
  }

  .info {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .quick-highlights {
    justify-content: center;
  }

  .info-image img {
    width: 90%;
  }

  .stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-card {
    width: 90%;
    max-width: 350px;
  }

  .cta-section {
    padding: 40px 20px;
  }
}
</style>
