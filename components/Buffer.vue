<template>
  <div></div>
</template>

<script>

export default {
  data() {
    return {
      actions: null,
      r_actions: null,
      retry: null
    }
  },
  methods: {
    checkAction: function() {
      this.actions = setInterval(async () => {
        if (this.$store.state.user.actions.length != 0) {
          console.log(this.$store.state.user.actions)
          if (!this.$store.state.user.lock) {
            this.$store.commit("user/setLock", true);
            clearInterval(this.actions);
            const transac = this.$store.state.user.actions[0];
            try {
               console.log(`claiming`, transac.id)
               this.$root.$emit(`claiming`, transac.id)
              const result = await this.$store.state.user.wax.api.transact(
                transac.action, transac.block
              )
              console.log(`success`, transac.id)
               this.$root.$emit(`success`, transac.id)
               this.$store.commit("user/rmAction", transac);
              this.$store.commit("user/setLock", false);
              this.checkAction()
            }
            catch (e) {
              let retry_t = {...transac}
              retry_t.retry = 1;
              this.$store.commit("user/rmAction", transac);
              this.$store.commit("user/addRetryAction", retry_t);
              this.$store.commit("user/setLock", false);
              this.checkAction()
            }
          }
        }
      }, 1000)
    },
    checkRetry: function() {
      this.retry = setInterval(async () => {
        if (this.$store.state.user.retry.length != 0) {
          console.log(this.$store.state.user.retry)
          if (!this.$store.state.user.lock) {
            this.$store.commit("user/setLock", true);
            clearInterval(this.retry);
            const transac = this.$store.state.user.retry[0];
            try {
              console.log(`retry`, transac)
              this.$root.$emit(`retry`, transac)
              const result = await this.$store.state.user.wax.api.transact(
                transac.action, transac.block
              )
              console.log(`success`, transac.id)
               this.$root.$emit(`success`, transac.id)
               this.$store.commit("user/rmRetryAction", transac);
              this.$store.commit("user/setLock", false);
              this.checkRetry()
            }
            catch (e) {
              console.log(e)
              let retry_t = {...transac}
              retry_t.retry++;
              this.$store.commit("user/rmRetryAction", transac);
              this.$store.commit("user/addRetryAction", retry_t);
              this.$store.commit("user/setLock", false);
              this.checkRetry()
            }
          }
        }
      }, 10000)
    },
    checkRepair: function() {
       this.r_actions = setInterval(async () => {
        if (this.$store.state.user.r_actions.length != 0) {
          console.log(this.$store.state.user.r_actions)
          if (!this.$store.state.user.lock) {

            this.$store.commit("user/setLock", true);
            clearInterval(this.r_actions);
            const transac = this.$store.state.user.r_actions[0];
            try {
              const result = await this.$store.state.user.wax.api.transact(
                transac.action, transac.block
              )
               this.$store.commit("user/rmRAction", transac);
              this.$store.commit("user/setLock", false);
              this.checkRepair()
            }
            catch (e) {
              let retry_t = {...transac}
              retry_t.retry = 1;
              this.$store.commit("user/rmRAction", transac);
              this.$store.commit("user/addRetryAction", retry_t);
              this.$store.commit("user/setLock", false);
              this.checkRepair()
            }
          }
        }
      }, 3000)
    }
  },
  mounted() {
    this.checkAction();
    this.checkRepair();
    this.checkRetry();
  },
}
</script>
