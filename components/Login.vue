<template>
  <div class="login-form">
    <select v-model="selected" class="api-selector">
      <option v-for="opt in options" :key="opt">
        {{ opt }}
      </option>
    </select>
    <b-button variant="success" @click="login">Login on WAX</b-button>
    <b-spinner label="Spinning" v-if="wait" class="spinner-login"></b-spinner>
  </div>
</template>

<script>
export default {
  name: "Login",
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      wait: false,
      options: [
        "https://api.wax.greeneosio.com",
        "https://wax.cryptolions.io",
        "https://api-wax.eosauthority.com",
        "https://wax.greymass.com",
        /*"https://wax.alohaeos.com",
        "https://wax.waxsweden.com",
        "https://wax.pink.com",
        "https://wax.dapplica.com",
        "https://wax.eosphere.com",*/
      ],
      selected: "https://api.wax.greeneosio.com",
    };
  },
  methods: {
    login: async function () {
      this.wait = true;
      localStorage.setItem("rpc", this.selected)
      await this.$store.commit("user/login", this.selected);
      const wax = this.$store.state.user.wax;
      //console.log(wax);
      const waitLoging = setInterval(() => {
        if (wax != null && wax.userAccount != undefined) {
          clearInterval(waitLoging);
          this.$store.commit("user/setUser");
          this.$emit("logged");
        }
      }, 1000);
    },
  },
  mounted() {
     if (localStorage.getItem("rpc")) {
       this.selected = localStorage.getItem("rpc");
     }
    if (localStorage.getItem("autoLogin") && localStorage.getItem("autoLogin") == "true")
    {
      this.login();
    }
  },
};
</script>

<style>
.login-form {
  display: flex;
  justify-content: center;
  margin-top: 2%;
}
.api-selector {
  margin-right: 1%;
}
.spinner-login {
  margin-left: 1%;
  color: grey;
}
</style>
