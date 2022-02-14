<template>
  <div>
     <div class="devinfo">
      <p class="txt">
        Created by
        <span class="dev1"> Azod#9999 (vzfjg.wam) </span>
        &&
        <span class="dev2"> HME#1240 (43xts.wam) </span>
        (v2.5.3)
      </p>
    </div>
    <DefiLogo v-if="name == ''"/>
    <Login v-if="name == ''" />
    <div v-else>
      <Interval />
      <Test />
    </div>
  </div>
</template>

<script>
import DefiLogo from "../components/DefiLogo.vue";
import Login from "../components/Login.vue";
import Interval from "../components/Interval.vue";
import Test from "~/components/Test.vue";
import Buffer from "../components/Buffer.vue";

export default {
  name: "IndexPage",
  components: {
    DefiLogo,
    Login,
    Interval,
    Test,
    Buffer
},
  computed: {
    name() {
      return this.$store.state.user.name;
    },
  },
};
</script>

<style>
body {
  /* background-color: #111c38; */
  background-color: rgb(34, 34, 34);
  color: aliceblue;
}

.devinfo {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  background-color: rgba(58, 58, 58, 0.096);
}
.txt {
  text-align: left;
  font-weight: bold;
  margin-left: 20px;
}
.dev1 {
  color: #d666e0;
}
.dev2 {
  color: #e74c3c;
}
</style>
