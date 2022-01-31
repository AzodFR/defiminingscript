<template>
  <div>
    <img alt="Vue logo" src="./assets/defi.png" />
    <div v-if="user.name.length == 0">
      <form @submit.prevent="this.user.login()">
        <Button type="submit" label="Login to WAX" class="p-button-success" />
      </form>
    </div>
    <div v-else>
      {{ user.name }}
      {{ user.dme }}
      {{ user.dmt }}
      <div>
        Ingame: {{user.ig_rss.join(" | ")}}
      </div>
      <hr />
      <div class="solar-panel">
        <h2>Electricity</h2>
        <split-carousel height="250" arrow-visible="always" display-amount=10>
          <split-carousel-item v-for="item in user.solar" :key="item">
            <img
              :src="'https://ipfs.atomichub.io/ipfs/' + item.img"
              referrerpolicy="no-referrer"
              style="width: 100%"
            />
            {{ item.name }}
            {{ item.current_durability }} / {{ item.durability }}
            {{ item.claim }}
          </split-carousel-item>
        </split-carousel>
      </div>
      <hr />
      <div class="rigs">
        <h2>Rigs</h2>
        <split-carousel height="250" arrow-visible="always" display-amount=10>
          <split-carousel-item v-for="item in user.rigs" :key="item">
            <img
              :src="'https://ipfs.atomichub.io/ipfs/' + item.img"
              referrerpolicy="no-referrer"
              style="width: 100%"
            />
            {{ item.name }}
            {{ item.current_durability }} / {{ item.durability }}
            {{ item.claim }}
          </split-carousel-item>
        </split-carousel>
      </div>
      <hr />
      <div class="workshops">
        <h2>Workshops</h2>
        <split-carousel height="250" arrow-visible="always" display-amount=10>
          <split-carousel-item v-for="item in user.workshops" :key="item">
            <img
              :src="'https://ipfs.atomichub.io/ipfs/' + item.img"
              referrerpolicy="no-referrer"
              style="width: 100%"
            />
            {{ item.name }}
            {{ item.current_durability }} / {{ item.durability }}
            {{ item.claim }}
          </split-carousel-item>
        </split-carousel>
      </div>
    </div>
    <footer style="   position:absolute;
   bottom:0;">
      Created by Azod#9999
    </footer>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { useUserStore } from "./store/store";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
  },
  setup() {
    const user = useUserStore();
    window.stores = { user };
    return { user };
  },
  methods: {},
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  margin-top: 60px;
}

body {
  background-color: #111c38;
}
</style>
