<template>
  <div>
    <b-button :variant="value ? 'success' : 'danger'" @click="autoOne" :class="value ? 'success' : 'danger'" size="sm">
      R {{value ? '[ON]' : '[OFF]'}}
    </b-button>
  </div>
</template>

<script>
export default {
  name: "LocalAutoClaimButton",
  data() {
    return {
      value: this.$store.state.user.autorepair[this.type][this.id]
    };
  },
  props: {
    type: String,
    id: String,
  },
  methods: {
    autoOne: function() {
      const actual = this.$store.state.user.autorepair[this.type][this.id];
      if (actual) {
        localStorage.setItem(`${this.type}AutoRepair`, "false");
        this.$store.commit("user/setAutoRepair", {
            type: this.type,
            id: "global",
            value: false,
          });
           this.$root.$emit(`${this.type}disableRepairAll`)
      }
      localStorage.setItem(`${this.id}_r`, `${!actual}`);
        this.$store.commit("user/setAutoRepair", {
          type: this.type,
          id: this.id,
          value: !actual,
        });
      this.value = this.$store.state.user.autorepair[this.type][this.id]
    }
  },
  mounted() {
    this.$root.$on(`${this.type}autoRepairAll`, () => {
      localStorage.setItem(`${this.id}_r`, `true`);
        this.$store.commit("user/setAutoRepair", {
          type: this.type,
          id: this.id,
          value: true,
        });
        this.value = this.$store.state.user.autorepair[this.type][this.id];
    })
  },
};
</script>

<style>
.local-button{
  font-size: small;
}
</style>
