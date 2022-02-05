<template>
  <div>
    <div class="info-user">
      <div class="login">
        {{ user.name }}
      </div>
      <div class="wax-title">
        Balance
        <p class="wax-value">{{ user.tokens["WAX"] }} ￦</p>
      </div>
      <div class="wax-title">
        Staking
        <p class="wax-value">397.62 ￦</p>
      </div>
      <div class="cpu">
        CPU
        <p class="cpu-value">29%</p>
      </div>
    </div>
    <div class="info-game">
      <div class="token-info">
        <label class="token-title">Tokens:</label>
        <p class="game-info-t">{{ user.tokens["DMT"] }}</p>
        <p class="game-info-t">{{ user.tokens["DME"] }}</p>
        <p class="game-info-t">{{ user.tokens["DMC"] }}</p>
      </div>
      <div class="ingame-info">
        <label class="ingame-title">InGame:</label>
        <p class="game-info">{{ user.ressources["DMT"] }}</p>
        <p class="game-info">{{ user.ressources["DME"] }}</p>
        <p class="game-info">{{ user.ressources["DMC"] }}</p>
      </div>
      <div class="ingame-logo">
        <p></p>
        <p><img src="../assets/DMT.png" class="game-img" /></p>
        <p><img src="../assets/DME.png" class="game-img" /></p>
        <p><img src="../assets/DMC.png" class="game-img" /></p>
      </div>
      <div class="daily-info">
        <label class="daily-title">Daily Cost/Mine:</label>
        <p
          :class="
            (user.production['DMT'] - user.cost['DMT']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          "
        >
          {{ ((user.production["DMT"] - user.cost["DMT"]).toFixed(4) * 24).toFixed(4) }}
        </p>
        <p :class="
            (user.production['DME'] - user.cost['DME']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          ">
          {{ ((user.production["DME"] - user.cost["DME"]) * 24).toFixed(4) }}
        </p>
        <p :class="
            (user.production['DMC'] - user.cost['DMC']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          ">
          {{ ((user.production["DMC"] - user.cost["DMC"]).toFixed(4) * 24).toFixed(4) }}
        </p>
      </div>
    </div>
    <div class="energy-profit">
      <div class="energy">
        <label class="energy-title">Energy:</label
        ><label class="energy-value">{{user.energy}}/500000</label>
      </div>
      <div class="profit">
        <label class="profit-title">Daily Profit:</label
        ><label class="energy-value">17 ￦</label>
      </div>
    </div>
    <div class="items">
      <ItemClaim
        title="Rigs"
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
    <div class="items">
      <ItemClaim
        title="Workshops"
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
    <div class="items">
      <ItemClaim
        title="Electricity"
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
export default {
  name: "Test",
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  components: { ItemClaim },
};
</script>

<style>
.info-user {
  display: flex;
  justify-content: space-around;
  width: 50%;
  margin-left: 25%;
  border: 1px solid rgba(128, 128, 128, 0.363);
}

.login {
  background-color: rgb(133, 40, 128);
  height: 100%;
  padding: 0.5em;
  border-radius: 5%;
  margin-top: 1%;
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
  background-color: #28a745;
  border-radius: 5%;
  margin-top: 1%;
  padding-left: 0.5em;
  padding-right: 0.5em;
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
}

.game-img {
  height: 25px;
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
  background-color: rgb(1, 80, 1);
}
.daily-info-neg {
  text-align: center;
  background-color: rgb(110, 2, 2);
}

.energy-profit {
  display: flex;
  justify-content: space-around;
  width: 50%;
  margin-left: 25%;
  border: 1px solid rgba(128, 128, 128, 0.363);
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
  background-color: rgb(1, 80, 1);
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
