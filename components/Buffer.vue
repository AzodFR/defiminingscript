<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      actions: null,
      r_actions: null,
      retry: null,
      check_a: true,
      check_b: true,
      check_c: true
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    checkAction: function () {
      this.actions = setInterval(async () => {
        if (!this.user.lock) {
          if (this.user.actions.length != 0) {
            console.log(this.user.actions);
            if (!this.user.lock) {
              this.$store.commit("user/setLock", true);
              clearInterval(this.actions);
              const transac = this.user.actions[0];
              if (this.user.actions.length != 0) {
                try {
                  console.log(`claiming`, transac.id);
                  this.$root.$emit(`claiming`, transac.id);
                  const result = await this.user.wax.api.transact(
                    transac.action,
                    transac.block
                  );
                  console.log(`success`, transac.id);
                  this.$root.$emit(`success`, transac.id);
                  this.$store.commit("user/rmAction", transac);
                  setTimeout(() => {this.checkAction()}, 3000);
                } catch (e) {
                  let retry_t = { ...transac };
                  retry_t.retry = 1;
                  this.$store.commit("user/addRetryAction", retry_t);
                  this.$store.commit("user/rmAction", transac);
                  setTimeout(() => {this.checkAction()}, 3000);
                }
              }
            }
          }
        }
      }, 3000);
    },
    checkRetry: function () {
      this.retry = setInterval(async () => {
        if (!this.user.lock) {
          if (this.user.retry.length != 0) {
            console.log(this.user.retry);
            if (!this.user.lock) {
              this.$store.commit("user/setLock", true);
              clearInterval(this.retry);
              const transac = this.user.retry[0];
              if (this.user.retry.length != 0) {
                try {
                  console.log(`retry`, transac);
                  this.$root.$emit(`retry`, transac);
                  const result = await this.user.wax.api.transact(
                    transac.action,
                    transac.block
                  );
                  console.log(`success`, transac.id);
                  this.$root.$emit(`success`, transac.id);
                  this.$store.commit("user/rmRetryAction", transac);
                  this.$store.commit("user/setLock", false);
                  this.checkRetry();
                } catch (e) {
                  console.log(e);
                  let retry_t = { ...transac };
                  retry_t.retry++;
                  this.$store.commit("user/rmRetryAction", transac);
                  this.$store.commit("user/addRetryAction", retry_t);
                  this.$store.commit("user/setLock", false);
                  this.checkRetry();
                }
              }
            }
          }
        }
      }, 10000);
    },
    checkRepair: function () {
      this.r_actions = setInterval(async () => {
        if (!this.user.lock) {
          if (this.user.r_actions.length != 0) {
            console.log(this.user.r_actions);
            if (!this.user.lock) {
              this.$store.commit("user/setLock", true);
              clearInterval(this.r_actions);
              const transac = this.user.r_actions[0];
              if (this.user.r_actions.length != 0) {
                try {
                  const result = await this.user.wax.api.transact(
                    transac.action,
                    transac.block
                  );
                  this.$store.commit("user/rmRAction", transac);
                  this.$store.commit("user/setLock", false);
                  this.checkRepair();
                } catch (e) {
                  let retry_t = { ...transac };
                  retry_t.retry = 1;
                  this.$store.commit("user/rmRAction", transac);
                  this.$store.commit("user/addRetryAction", retry_t);
                  this.$store.commit("user/setLock", false);
                  this.checkRepair();
                }
              }
            }
          }
        }
      }, 3000);
    },
  },
  mounted() {
    this.checkAction();
    this.checkRepair();
    this.checkRetry();
    // setInterval(() => {
    //   this.$root.$emit(`test`, 999);
    //   console.log("test emitted");
    // }, 5000);
  },
};
</script>
