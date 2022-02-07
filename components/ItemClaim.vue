<template>
  <div>
    <div>
      <label class="title">{{ title }}   <img alt="" :src="logo" class="game-img" /></label>
      <AutoClaimButton v-if="show.claimAll" :type="type" class="allBtn-1" />
      <div v-else class="blank"></div>
      <AutoRepairButton v-if="show.repairAll" :type="type" class="allBtn-2" />
      <div v-else class="blank"></div>
    </div>
    <div class="items-claim">
      <div class="item-claim" v-for="(item, i) in list" :key="i">
        <label class="item-name">{{ item.name.slice(toTrim) }}</label>
        <CounterV2
        ref="counter"
          class="counter-div"
          :item="item"
          :timestamp="item.claim_time"
          :claiminfo="claimInfo"
          :autoclaim="
            `this.$store.state.user.items['${type}']['item.asset_id']` === true
          "
        />
        <label class="item-durability"
          >{{ item.current_durability }}/{{ item.durability }}</label
        >
        <LocalAutoClaimButton
          :type="type"
          :id="item.asset_id"
          v-if="show.localClaim"
          class="claim-btn"
        />
        <div v-else class="blank2"></div>
        <LocalAutoRepairButton
          :type="type"
          :id="item.asset_id"
          v-if="show.localRepair"
          class="repair-btn"
        />
        <div v-else class="blank2"></div>
        <div class="info-pop"><label :id="'pop-'+type+i">ⓘ</label></div>
        <b-popover :target="'pop-'+type+i" triggers="hover" placement="top">
          <!-- <p>ID: {{item.asset_id}}</p> -->
          <div>Claim before repair: {{(item.durability - item.current_durability) / item.durability_usage}}</div>
          <div>Repair cost: {{
              ((item.durability - item.current_durability) * 0.01).toFixed(4)
            }}
            DMC</div>
            <div>
              +{{ ((item.production * 0.0304) / 24).toFixed(4) }}
            {{ item.claim_type }}/h
            </div>
            <div>-{{ (item.durability_usage * 0.01).toFixed(4) }} DMC/h</div>
            <div>-{{ (item.power_usage * 0.000085).toFixed(4) }} DME/h</div>
        </b-popover>
      </div>
    </div>
  </div>
</template>

<script>
import CounterV2 from "./CounterV2.vue";
import LocalAutoClaimButton from "./LocalAutoClaimButton.vue";
export default {
  props: {
    title: String,
    logo: String,
    toTrim: Number,
    list: Array,
    type: String,
    show: Object,
    claimInfo: Object,
  },
  components: { CounterV2, LocalAutoClaimButton },
  mounted() {
    console.log(this.$refs.counter[0])
    this.$root.$on(`test`, (id) => {
      console.log("itemclaim receive test from ", id)
      this.$refs.counter[0].$emit(`test`, id)
    })
    this.$root.$on(`claiming`, (id) => {
      console.log("itemclaim receive claiming from ", id)
      this.$refs.counter[0].$emit(`${id}.claiming`)
    })
    this.$root.$on(`success`, (id) => {
      console.log("itemclaim receive success from ", id)
      this.$refs.counter[0].$emit(`${id}.success`)
    })

    this.$root.$on(`retry`, (transac) => {
      console.log("itemclaim receive retry from ", transac.id)
      this.$refs.counter[0].$emit(`${transac.id}.retry`, transac.retry)
    })
  },
};
</script>

<style>
.items-claim {
  margin-top: 2%;
}
.title {
  display: inline-block;
  width: 30%;
  font-size: large;
  background-color: rgba(128, 128, 128, 0.534);
  text-align: center;
}
.blank {
  display: inline-block;
  width: 30%;
  font-size: large;
}
.allBtn-1 {
  display: inline-block;
  width: 30%;
  font-size: large;
  text-align: right;
}
.allBtn-2 {
  display: inline-block;
  width: 30%;
  font-size: large;
  text-align: left;
}

.buttonAll {
  font-size: small;
  text-decoration: none;
  size: 0%;
}

.item-name {
  font-size: small;
  text-align: right;
  display: inline-block;
  width: 15%;
}

.counter-div {
  display: inline-block;
  width: 15%;
  text-align: center;
}

.item-durability {
  display: inline-block;
  font-size:small;
  width: 15%;
  text-align: right;
}
.success {
  font-size: 0.7em;
  font-weight: none;
  size: 0%;
}
.danger {
  font-size: 0.7em;
  font-weight: none;
  height: 100%;
}

.claim-btn {
  display: inline-block;
  width: 15%;
  text-align: right;
}
.repair-btn {
  display: inline-block;
  width: 15%;
  text-align: left;
}

.blank2 {
  display: inline-block;
  width: 15%;
}

.info-pop {
  display: inline-block;
  width: 15%;
  text-align: left;
}
</style>
