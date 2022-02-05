<template>
  <div>
    <b-button :variant="actual ? 'success' : ''" @click="autoAll" class="buttonAll" :disabled="actual">
      Auto Repair All
    </b-button>
  </div>
</template>

<script>
export default {
  name: "AutoClaimButton",
  props: {
    type: String,
  },
  data() {
    return {
      actual: false
    }
  },
  methods: {
    autoAll: function() {
      localStorage.setItem(`${this.type}AutoRepair`, true);
        this.$store.commit("user/setAutoRepair", {
          type: this.type,
          id: "global",
          value: true,
        });
          this.$store.state.user.items[this.type].forEach((elem) => {
            localStorage.setItem(elem.asset_id, true);
            this.$store.commit("user/setAutoRepair", {
              type: this.type,
              id: elem.asset_id,
              value: true,
            });
          });
          this.actual = true;
          this.$root.$emit(`${this.type}autoRepairAll`)
    }
  },
  mounted() {
    if (localStorage.getItem(`${this.type}AutoRepair`)) {
      let param = localStorage.getItem(`${this.type}AutoRepair`);
      if (param == "true") {
        this.actual = true;
        this.$store.commit("user/setAutoRepair", {
          type: this.type,
          id: "global",
          value: true,
        });
        this.$store.state.user.items[this.type].forEach((elem) => {
          localStorage.setItem(elem.asset_id, "true");
          this.$store.commit("user/setAutoRepair", {
            type: this.type,
            id: elem.asset_id,
            value: true,
          });
        });
      }
    }
    this.$root.$on(`${this.type}disableRepairAll`, () => {
        this.actual = false;
    })
  },
};
</script>
