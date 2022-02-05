<template>
  <div>
    <button class="DisBtn" v-if="!ISreadyToClaim" disabled>
      {{ remainingTime }}
    </button>
    <button class="EnBtn" v-else @click="handleClaim">CLAIM</button>
    <!--<button @click="test">test</button>-->
    <b-spinner label="Spinning" v-if="wait" class="spinner-login"></b-spinner>
  </div>
</template>

<script>
import * as waxjs from "@waxio/waxjs/dist";
export default {
  name: "Counter",
  props: ["timestamp", "autoclaim", "item", "claiminfo"],
  data() {
    return {
      wait: false,
      loaded: false,
      readyToClaim: false,
      displayHours: 0,
      displayMinutes: 0,
      displaySeconds: 0,
    };
  },
  computed: {
    ISreadyToClaim() {
      return this.readyToClaim;
    },
    _seconds() {
      return 1000;
    },
    _minutes() {
      return this._seconds * 60;
    },
    _hours() {
      return this._minutes * 60;
    },
    remainingTime() {
      if (this.loaded) {
        return (
          this.displayHours +
          ":" +
          this.displayMinutes +
          ":" +
          this.displaySeconds
        );
      } else {
        return "Getting remaining time...";
      }
    },
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    timestamp: function () {
      this.loaded = false;
      this.readyToClaim = false;
      this.showRemaining();
    },
    // eslint-disable-next-line object-shorthand
    autoclaim: function () {
      if (this.autoclaim) {
        this.loaded = false;
        this.readyToClaim = false;
        this.showRemaining();
      }
    },
  },
  mounted() {
    this.showRemaining();
  },
  methods: {
    /*test() {
      console.log("Integrity_usage :");
      console.log(this.item.current_durability);
      console.log(this.item.durability_usage);
      console.log(this.item.current_durability >= this.item.durability_usage);
    },*/
    showRemaining() {
      const timer = setInterval(() => {
        const now = new Date();
        const end = new Date(this.timestamp * 1000);
        const distance = end.getTime() - now.getTime();

        if (distance <= 0) {
          clearInterval(timer);
          this.readyToClaim = true;
          this.loaded = true;
          console.log(
            this.$store.state.user.autoclaim[this.claiminfo.type][
              this.item.asset_id
            ]
          );
          if (
            this.$store.state.user.autoclaim[this.claiminfo.type][
              this.item.asset_id
            ] === true
          ) {
            console.log("AutoClaim timer = 0");
            console.log(this.claiminfo.type);
            console.log(this.claiminfo.action);
            console.log(this.item.asset_id);
            if (this.item.current_durability >= this.item.durability_usage) {
              this.handleClaim();
            }
          }
          return null;
        }

        const hours = Math.floor(distance / this._hours);
        const minutes = Math.floor((distance % this._hours) / this._minutes);
        const seconds = Math.floor((distance % this._minutes) / this._seconds);
        this.displayHours = hours < 10 ? "0" + hours : hours;
        this.displayMinutes = minutes < 10 ? "0" + minutes : minutes;
        this.displaySeconds = seconds < 10 ? "0" + seconds : seconds;

        this.loaded = true;
      }, 1000);
    },
    async handleClaim() {
      if (this.$store.state.user.lock) return;
      this.$store.commit("user/setLock", true)
      console.log("ready to claim !");
      console.log(this.item.asset_id);
      const test =
        this.$store.state.user.autoclaim[this.claiminfo.type][
          this.item.asset_id
        ];
      console.log(this.$store.state.user.name);

      try {
        this.wait = true;
        this.readyToClaim = false;
        const data =
          this.claiminfo.action == "claimdmc"
            ? { username: this.$store.state.user.name }
            : { to: this.$store.state.user.name, asset_id: this.item.asset_id };
        console.log("test:", data);
        const res = await this.$store.state.user.wax.api.transact(
          {
            actions: [
              {
                account: "defiminingio",
                name: this.claiminfo.action,
                authorization: [
                  {
                    actor: this.$store.state.user.name,
                    permission: "active",
                  },
                ],
                data: data,
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        );
        console.log(res);
        if (
          this.item.current_durability <= this.item.durability / 2 &&
          this.$store.state.user.autorepair[this.claiminfo.type][
            this.item.asset_id
          ]
        ) {
          let cost =
            (this.item.durability - this.item.current_durability) * 0.01;
            if (this.$store.state.user.ressources["DMC"] >= cost) {
              const res2 = await this.$store.state.user.wax.api.transact(
          {
            actions: [
              {
                account: "defiminingio",
                name: this.claiminfo.r_action,
                authorization: [
                  {
                    actor: this.$store.state.user.name,
                    permission: "active",
                  },
                ],
                data: { to: this.$store.state.user.name, asset_id: this.item.asset_id },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        );
        console.log(res2);
            }

        }
        //alert("claiming !");
      } catch (e) {
        console.log(e);
      }
      this.wait = false;
      this.$store.commit("user/setLock", false)
    },
  },
};
</script>

<style scoped>
button {
  border-radius: 5px;
  border: none;
  font-weight: bold;
  box-shadow: 1px 1px 0px 1px rgba(0, 0, 0, 0.2);
}
.DisBtn {
  background: rgb(216, 146, 16);
  color: rgb(15, 12, 5);
  font-size: small;
}
.EnBtn {
  background: rgb(98, 194, 20);
  color: rgb(15, 27, 14);
  font-size: small;
}
</style>
