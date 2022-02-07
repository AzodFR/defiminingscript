<template>
  <div>
    <Buffer ref="buffer" />
    <div class="info-user">
      <DefiLogo class="logo-top" />

      <div class="login">
        <label class="login-value">{{ user.name }}</label>
         <div class="cpu">
          CPU
          <label
            :class="
              user.cpu >= 80
                ? 'cpu-value cpu-high'
                : user.cpu >= 60
                ? 'cpu-value cpu-mid'
                : 'cpu-value cpu-low'
            "
            >{{ user.cpu }}%</label
          >
        </div>
      </div>
      <div class="wax-info">
        <div class="wax-title">
          Balance
          <label class="wax-value">{{ parseFloat(user.tokens["WAX"]).toFixed(2) }} ￦</label>
        </div>
        <div class="wax-title">
          Staking
          <label class="wax-value">{{ user.stake }} ￦</label>
        </div>
      </div>
      <div class="energy-profit">
        <div class="energy">
          <label class="energy-title">Energy:</label
          ><label
            :class="
              user.energy > 250000
                ? 'energy-value cpu-low'
                : user.energy > 100000
                ? 'energy-value cpu-mid'
                : 'energy-value cpu-high'
            "
            >{{ user.energy }}/500000</label
          >
        </div>
        <div class="profit">
          <label class="profit-title">Daily Profit:</label
          ><label class="energy-value cpu-low">17 ￦</label>
        </div>
      </div>
      <div class="token-div">
        <label class="token-title">Tokens:</label>
        <p class="game-info-t">{{ user.tokens["DMT"] }}</p>
        <p class="game-info-t">{{ user.tokens["DMC"] }}</p>
        <p class="game-info-t">{{ user.tokens["DME"] }}</p>
      </div>
      <div class="ingame-div">
        <label class="ingame-title">InGame:</label>
        <p class="game-info">{{ user.ressources["DMT"] }}</p>
        <p class="game-info">{{ user.ressources["DMC"] }}</p>
        <p class="game-info">{{ user.ressources["DME"] }}</p>
      </div>
      <!-- <div class="token-logo-div">
        <p></p>
        <p>DMT <img src="../assets/DMT.png" class="game-img" /></p>
        <p>DMC <img src="../assets/DMC.png" class="game-img" /></p>
        <p>DME <img src="../assets/DME.png" class="game-img" /></p>
      </div> -->
      <div class="daily-div">
        <label class="daily-title">Daily Cost/Mine:</label>
        <p
          :class="
            (user.production['DMT'] - user.cost['DMT']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          "
        >
          {{
            (
              (user.production["DMT"] - user.cost["DMT"]).toFixed(4) * 24
            ).toFixed(4)
          }}
          DMT <img src="../assets/DMT.png" class="game-img" />
        </p>
        <p
          :class="
            (user.production['DMC'] - user.cost['DMC']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          "
        >
          {{
            (
              (user.production["DMC"] - user.cost["DMC"]).toFixed(4) * 24
            ).toFixed(4)
          }}
          DMC <img src="../assets/DMC.png" class="game-img" />
        </p>
        <p
          :class="
            (user.production['DME'] - user.cost['DME']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          "
        >
          {{
            ((user.production["DME"] - user.cost["DME"]) * 24).toFixed(4)
          }}
          DME <img src="../assets/DME.png" class="game-img" />
        </p>
      </div>
    </div>

    <div class="items" v-if="this.$store.state.user.items['rigs'].length">
      <ItemClaim
        ref="rigs"
        title="Rigs"
        logo="/_nuxt/img/DMT.79c3a9f.png"
        :toTrim="4"
        :list="this.$store.state.user.items['rigs']"
        type="rigs"
        :show="{
          claimAll: true,
          repairAll: true,
          localClaim: true,
          localRepair: true,
        }"
        :claimInfo="{
          type: 'rigs',
          action: 'claimrig',
          r_action: 'repairrig',
        }"
      />
    </div>
    <div class="items" v-if="this.$store.state.user.items['workshops'].length">
      <ItemClaim
        title="Workshops"
        ref="claim"
        logo="/_nuxt/img/DMC.6f40dd0.png"
        :toTrim="0"
        :list="this.$store.state.user.items['workshops']"
        type="workshops"
        :show="{
          claimAll: true,
          repairAll: false,
          localClaim: true,
          localRepair: false,
        }"
        :claimInfo="{
          type: 'workshops',
          action: 'claimdmc',
          r_action: 'repairws',
        }"
      />
    </div>
    <div
      class="items"
      v-if="this.$store.state.user.items['elecsources'].length"
    >
      <ItemClaim
        title="Electricity"
        ref="claim"
        logo="/_nuxt/img/DME.cab925c.png"
        :toTrim="0"
        :list="this.$store.state.user.items['elecsources']"
        type="elecsources"
        :show="{
          claimAll: true,
          repairAll: true,
          localClaim: true,
          localRepair: true,
        }"
        :claimInfo="{
          type: 'elecsources',
          action: 'claimelec',
          r_action: 'repairelec',
        }"
      />
    </div>
  </div>
</template>

<script>
import ItemClaim from "./ItemClaim.vue";
import Buffer from "./Buffer.vue";
import DefiLogo from "./DefiLogo.vue";

const getRandomValues = require("get-random-values");

export default {
  name: "Test",
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  components: { ItemClaim, Buffer, DefiLogo },
  mounted() {

    this.$on(`test`, (id) => {
      console.log("main receive test from ", id)
      this.$emit('test', id)
    })
    this.$on(`claiming`, (id) => {
      console.log("itemclaim receive claiming from ", id)
      this.$emit(`${id}.claiming`)
    })
    this.$on(`success`, (id) => {
      console.log("itemclaim receive success from ", id)
      this.$emit(`${id}.success`)
    })

    this.$on(`retry`, (transac) => {
      console.log("itemclaim receive retry from ", transac.id)
      this.$emit(`${transac.id}.retry`, transac.retry)
    })
  },
};
</script>

<style>
.info-user {
  margin-left: 25%;
  margin-right: 25%;
  border: 1px solid rgba(128, 128, 128, 0.363);
}

.logo-top {
  display: inline-block;
  width: 10%;
  vertical-align: top;
}

.wax-info {
  display: inline-block;
  text-align: left;
  width: 20%;
  vertical-align: top;
}

.login {
  display: inline-block;
  width: 15%;
  margin-left: 2%;
  vertical-align: top;
}
.login-value {
  background-color: rgb(133, 40, 128);
  padding: 0.5em;
  border-radius: 5%;
}

.wax-value {
  background-color: rgb(211, 140, 9);
  border-radius: 5%;
  margin-top: 1%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.wax-title {
  margin-top: 0.5%;
}

.cpu {
  margin-top: 0.5%;
}
.cpu-value {
  border-radius: 5%;
  margin-top: 1%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}
.cpu-high {
  background-color: rgb(110, 2, 2);
}
.cpu-mid {
  background-color: rgb(110, 85, 2);
}

.cpu-low {
  background-color: #28a745;
}

.token-div {
  display: inline-block;
  font-size: small;
}
.ingame-div {
  display:inline-block;
  font-size: small;
  margin-right: 1%;
}
.token-logo-div {
  display: inline-block;
  font-size: small;
}
.daily-div {
  display: inline-block;
  font-size: small;
}
/************************/

.info-game {
  display: flex;
  justify-content: space-around;
  width: 50%;
  margin-left: 25%;
  border: 1px solid rgba(128, 128, 128, 0.363);
}

.token-info {
  font-size: small;
  margin-top: 1%;
}
.token-title {
  background-color: rgba(128, 128, 128, 0.534);
  border-radius: 5%;
  margin-top: 2%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.game-info-t {
  text-align: right;
  width: 100%;
}

.ingame-info {
  font-size: small;
  margin-top: 1%;
}
.ingame-title {
  background-color: rgba(128, 128, 128, 0.534);
  border-radius: 5%;
  margin-top: 2%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}
.game-info {
  text-align: right;
}
.ingame-logo {
  margin-top: 1%;
  font-size: small;
}

.game-img {
  height: 15px;
}

.daily-info {
  font-size: small;
  margin-top: 1%;
}

.daily-title {
  background-color: rgba(128, 128, 128, 0.534);
  border-radius: 5%;
  margin-top: 2%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.daily-info-pos {
  text-align: center;
  background-color: #28a745;
}
.daily-info-neg {
  text-align: center;
  background-color: rgb(110, 2, 2);
}

.energy-profit {
  display: inline-block;
  vertical-align: top;
  width: 25%;
}

.energy,
.profit {
  margin-top: 1%;
}

.energy-title,
.profit-title {
  margin-right: 0.5em;
  background-color: rgba(128, 128, 128, 0.534);
  border-radius: 5%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.energy-value {
  /* background-color: #28a745; */
  border-radius: 5%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.items {
  display: inline-block;
  justify-content: space-around;
  width: 50%;
  margin-left: 25%;
  border: 1px solid rgba(128, 128, 128, 0.363);
}
</style>
