<template>
  <div id="loginPage">
    <div class="dollars-login">
      <div class="main-img">
        <img src="../assets/dollars.png" draggable="false" style="select:none">
      </div>
      <div class="dollars-user">
        <span><strong style="color: white">USERNAME:</strong></span>
        <input class="username-input" type="text" v-model="username">
        <router-link to="/chatting">
          <button type="button" class="login-button" ref="submit"><strong style="color:white">ENTER</strong></button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginPage',
  data () {
    return {
      username: ''
    }
  },
  methods: {
    // 本地测试
    login () {
      this.$store.commit('userLogin', this.username)
      sessionStorage.setItem('username', this.username)
    }
  },
  mounted () {
    this.$refs.submit.addEventListener('click', this.login)
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  background-color: #0a0a0a;
}
.dollars-login {
  width: 25rem;
  height: 100%;
  margin: 0 auto;
  position: relative;
}
.main-img {
  position: absolute;
  width: 100%;
  height: 25rem;
  top: 6.25rem;
}
.dollars-user{
  position: absolute;
  width: 100%;
  height: 18.75rem;
  top: 35rem;
  text-align: center;
}
.main-img img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.username-input {
  display: inline-block;
  width: 10rem;
  height: 1.25rem;
  margin-left: 1rem;
  padding-left: 1.25rem;
  border-radius: 1.25rem;
  font-size: 1.1rem;
}
.login-button {
  width: 12rem;
  height: 1.5rem;
  margin-top: 2rem;
  font-size: 1rem;
  border: 2px solid white;
  border-radius: 1.5rem;
  background-color:#666666;
}
</style>
