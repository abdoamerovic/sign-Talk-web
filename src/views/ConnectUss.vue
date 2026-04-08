<template>
  <section>
    <MainNavbar />

    <div class="return">
      <router-link to="/">← Home</router-link>
    </div>

    <section class="contianer">
      <section class="leftpart">
        <img id="up" src="@/assets/images/m_icon.webp" />
        <img id="down" src="@/assets/images/f_icon.webp" />
        <img src="@/assets/images/connectimage.jpg" class="big_img" />
      </section>

      <section class="rightpart">
        <h1>Get in Touch</h1>
        <h3>speak.translate.connect</h3>
        <p>
          Have questions, ideas, or need support? We're<br />
          always here to help — feel free to reach out<br />
          anytime
        </p>

        <div class="p_1">
          <img src="@/assets/images/m_icon.webp" id="pic" />
          <div class="p_1_2">
            <h2>Quick Response</h2>
            <p>We'll get back to you within 24 hours</p>
          </div>
        </div>

        <div class="p_2">
          <img src="@/assets/images/f_icon.webp" id="pic" />
          <div class="p_2_2">
            <h2>Friendly Support</h2>
            <p>Our team is dedicated to helping you</p>
          </div>
        </div>

        <div class="p_3">
          <img src="@/assets/images/c_icon.webp" id="pic" />
          <div class="p_3_2">
            <h2>Community Driven</h2>
            <p>Join thousands of SignTalk users</p>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import MainNavbar from '@/components/MainNavbar.vue'
import '@/assets/css/connect.css'
export default {
  name: 'ConnectUss',
  components: { MainNavbar },
}
</script>

<style scoped>
.return a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  font-size: 18px;
}
.return a:hover {
  color: #e3a81f;
}

.contianer {
  display: flex;
  gap: 20px;
  padding: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.leftpart {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.leftpart .big_img {
  width: 100%;
  max-width: 350px;
  border-radius: 20px;
}

.rightpart {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.rightpart h1 {
  font-size: 32px;
  color: #007bff;
}

.rightpart h3 {
  font-size: 20px;
  color: #333;
}

.rightpart p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

.p_1,
.p_2,
.p_3 {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 15px;
  background: #f7f7f7;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.p_1 img,
.p_2 img,
.p_3 img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.p_1_2 h2,
.p_2_2 h2,
.p_3_2 h2 {
  font-size: 18px;
  margin: 0;
  color: #007bff;
}

.p_1_2 p,
.p_2_2 p,
.p_3_2 p {
  margin: 0;
  font-size: 14px;
  color: #555;
}

@media (max-width: 768px) {
  .contianer {
    flex-direction: column;
    align-items: center;
  }

  .leftpart,
  .rightpart {
    width: 90%;
  }
}
</style>
