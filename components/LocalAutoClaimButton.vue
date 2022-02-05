<template>
  <div>
    <b-button :variant="value ? 'success' : 'danger'" @click="autoOne" :class="value ? 'success' : 'danger'" size="sm">
      C {{value ? '[ON]' : '[OFF]'}}
    </b-button>
  </div>
</template>

<script>
export default {
  name: "LocalAutoClaimButton",
  props: {
    type: String,
    id: String,
  },
  data() {
    return {
      value: this.$store.state.user.autoclaim[this.type][this.id]
    }
  },
  methods: {
    autoOne: function() {
      const actual = this.$store.state.user.autoclaim[this.type][this.id];
      if (actual) {
        localStorage.setItem(`${this.type}AutoClaim`, "false");
        this.$store.commit("user/setAutoClaim", {
            type: this.type,
            id: "global",
            value: false,
          });
          this.$root.$emit(`${this.type}disableClaimAll`)
      }
      localStorage.setItem(`${this.id}`, `${!actual}`);
        this.$store.commit("user/setAutoClaim", {
          type: this.type,
          id: this.id,
          value: !actual,
        });
        this.value = this.$store.state.user.autoclaim[this.type][this.id];
    }
  },
  mounted() {
    this.$root.$on(`${this.type}autoClaimAll`, () => {
      localStorage.setItem(`${this.id}`, `true`);
        this.$store.commit("user/setAutoClaim", {
          type: this.type,
          id: this.id,
          value: true,
        });
        this.value = this.$store.state.user.autoclaim[this.type][this.id];
    })
  },
};
</script>

<style>
.local-button{
  font-size: small;
}
</style>
