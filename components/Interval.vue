<template>
  <div></div>
</template>

<script>
const time = 15000;
export default {
  name: "Interval",
  async mounted() {
    await this.getTemplates();
    this.fetchTokens();
    this.launchFetchStake();
    this.fetchUserInfo();
    this.launchIntervalTokens();
    this.launchIntervalInfo();
    this.fetchItems("rigs");
    this.fetchItems("elecsources");
    this.fetchItems("workshops");
    this.launchIntervalItems();
  },
  methods: {
    launchFetchStake: function() {
      this.fetchStake();
      setInterval(() => {
        this.fetchStake();
      }, time)
    },
    fetchStake: async function() {
await fetch("https://chain.wax.io/v1/chain/get_account", {
    "credentials": "omit",
    "headers": {
        "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
          "Content-Type": "text/plain;charset=UTF-8",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "cross-site",
    },
    "referrer": "https://fw.f12key.xyz/",
    "body": "{\"account_name\":\"vzfjg.wam\"}",
    "method": "POST",
    "mode": "cors"
}).then((x) => x.json())
        .then(async (rows) => {
          this.$store.commit("user/setStake", rows.total_resources.cpu_weight.split(" ")[0]);
          this.$store.commit("user/setCPU", (rows.cpu_limit.used * 100 / rows.cpu_limit.max).toFixed(0));
        })
    },
    launchIntervalItems: function () {
      setInterval(() => {
        this.fetchItems("rigs");
        this.fetchItems("elecsources");
        this.fetchItems("workshops");
      }, time);
    },
    findInTemplate: function (id) {
      let template;
      this.$store.state.user.templates.forEach((elem) => {
        if (elem.template_id == id) {
          template = elem;
        }
      });
      return template;
    },
    async fetchItems(item) {
      await fetch("https://wax.greymass.com/v1/chain/get_table_rows", {
        credentials: "omit",
        headers: {
          Accept: "*/*",
          "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
          "Content-Type": "text/plain;charset=UTF-8",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "cross-site",
        },
        referrer: "https://thedefimining.io/",
        body: `{\"json\":true,\"code\":\"defiminingio\",\"scope\":\"defiminingio\",\"table\":\"${item}\",\"table_key\":\"\",\"lower_bound\":\"${this.$store.state.user.name}\",\"upper_bound\":\"${this.$store.state.user.name}\",\"index_position\":2,\"key_type\":\"i64\",\"limit\":\"100\",\"reverse\":false,\"show_payer\":false}`,
        method: "POST",
        mode: "cors",
      })
        .then((x) => x.json())
        .then(async (items) => {
          const newList = [];
          await items.rows.forEach(async (elem) => {
            const tmp = this.findInTemplate(elem.template_id);
            elem.img = tmp.img;
            elem.durability_usage = tmp.durability_usage;
            elem.claim_type = tmp.claim_type;
            elem.production = tmp.production;
            elem.power_usage = tmp.power_usage;
            if (!this.$store.state.user.logged_asset.includes(elem.asset_id)) {
              this.$store.commit("user/addAsset", elem.asset_id);
              // si elem.claim_type === "DMT" : factor = 0.0304 / 24
              
              if (elem.claim_type === "DMT") {
                this.$store.commit("user/addProduction", {
                  type: elem.claim_type,
                  value: (elem.production * 0.0304) / 24,
                });
              }
              // si elem.claim_type === "DMC" : factor = 0.01
              if (elem.claim_type === "DMC") {
                this.$store.commit("user/addProduction", {
                  type: elem.claim_type,
                  value: elem.production * 0.01,
                });
              }
              // si elem.claim_type === "DME" : factor = 0.0001
              if (elem.claim_type === "DME") {
                this.$store.commit("user/addProduction", {
                  type: elem.claim_type,
                  value: elem.production * 0.0001,
                });
              }
              /*this.$store.commit("user/addProduction", {
                type: elem.claim_type,
                value: elem.production * factor,
              });*/
              this.$store.commit("user/addCost", {
                type: "DME",
                value: elem.power_usage * 0.000085,
              });
              this.$store.commit("user/addCost", {
                type: "DMC",
                value: elem.durability_usage / 100,
              });
            }
            if (localStorage.getItem(`${elem.asset_id}`)) {
              if (localStorage.getItem(`${elem.asset_id}`) == "true") {
                this.$store.commit("user/setAutoClaim", {
                  type: item,
                  id: elem.asset_id,
                  value: true,
                });
                this.checker = true;
              } else {
                this.$store.commit("user/setAutoClaim", {
                  type: item,
                  id: elem.asset_id,
                  value: false,
                });
              }
            }
            if (localStorage.getItem(`${elem.asset_id}_r`)) {
              if (localStorage.getItem(`${elem.asset_id}_r`) == "true") {
                this.$store.commit("user/setAutoRepair", {
                  type: item,
                  id: elem.asset_id,
                  value: true,
                });
                this.checker = true;
              } else {
                this.$store.commit("user/setAutoRepair", {
                  type: item,
                  id: elem.asset_id,
                  value: false,
                });
              }
            } else {
              this.$store.commit("user/setAutoRepair", {
                type: item,
                id: elem.asset_id,
                value: false,
              });
            }
            newList.push(elem);
            // newList.push(elem);
            // newList.push(elem);
            // newList.push(elem);
            // newList.push(elem);
            // newList.push(elem);
          });
          if (newList.length) {
            //console.log(newList)
            this.$store.commit("user/setItem", { value: newList, type: item });
          }
        });
    },
    async getTemplates() {
      await fetch(
        `${this.$store.state.user.wax.rpc.endpoint}/v1/chain/get_table_rows`,
        {
          credentials: "omit",
          headers: {
            Accept: "*/*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "text/plain;charset=UTF-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
          },
          referrer: "https://thedefimining.io/",
          body: `{\"json\":true,\"code\":\"defiminingio\",\"scope\":\"defiminingio\",\"table\":\"templates\",\"table_key\":\"\",\"lower_bound\":\"\",\"upper_bound\":\"\",\"limit\":\"100\",\"reverse\":false,\"show_payer\":false}`,
          method: "POST",
          mode: "cors",
        }
      )
        .then((x) => x.json())
        .then((y) => {
          this.$store.commit("user/setTemplates", y.rows);
        });
    },
    async launchIntervalInfo() {
      this.fetchUserInfo()
      setInterval(() => {
        this.fetchUserInfo();
      }, time);
    },
    async fetchUserInfo() {
      await fetch(
        `${this.$store.state.user.wax.rpc.endpoint}/v1/chain/get_table_rows`,
        {
          credentials: "omit",
          headers: {
            Accept: "*/*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "text/plain;charset=UTF-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
          },
          referrer: "https://thedefimining.io/",
          body: `{\"json\":true,\"code\":\"defiminingio\",\"scope\":\"defiminingio\",\"table\":\"users\",\"table_key\":\"\",\"lower_bound\":\"${this.$store.state.user.name}\",\"upper_bound\":\"${this.$store.state.user.name}\",\"limit\":\"100\",\"reverse\":false,\"show_payer\":false}`,
          method: "POST",
          mode: "cors",
        }
      )
        .then((x) => x.json())
        .then((user) => {
          this.$store.commit("user/setRessource", {
            type: "DME",
            value: user.rows[0].balance_dme / 10000,
          });
          this.$store.commit("user/setRessource", {
            type: "DMT",
            value: user.rows[0].balance_dmt / 10000,
          });
          this.$store.commit("user/setRessource", {
            type: "DMC",
            value: user.rows[0].balance_dmc / 10000,
          });
          this.$store.commit("user/setEnergy", user.rows[0].energy);
        });
    },
    async launchIntervalTokens() {
      this.fetchTokens();
      setInterval(() => {
        this.fetchTokens();
      }, time);
    },
    async fetchTokens() {
      await fetch(
        `${this.$store.state.user.wax.rpc.endpoint}/v1/chain/get_currency_balance`,
        {
          credentials: "omit",
          headers: {
            Accept: "*/*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "text/plain;charset=UTF-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
          },
          referrer: "https://thedefimining.io/",
          body: `{\"code\":\"defiminingtk\",\"account\":\"${this.$store.state.user.name}\"}`,
          method: "POST",
          mode: "cors",
        }
      )
        .then((x) => x.json())
        .then((y) => {
          const sym = ["DMC", "DME", "DMT"];
          for (let i = 0; i < 3; i++) {
            if (i >= y.length) {
              this.$store.commit("user/setToken", {
                type: sym[i],
                value: "0.0000",
              });
            } else {
              this.$store.commit("user/setToken", {
                type: y[i].split(" ")[1],
                value: y[i] != undefined ? y[i].split(" ")[0] : "0.0000",
              });
            }
          }
        });

      await fetch(
        `${this.$store.state.user.wax.rpc.endpoint}/v1/chain/get_currency_balance`,
        {
          credentials: "omit",
          headers: {
            Accept: "*/*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "text/plain;charset=UTF-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
          },
          referrer: "https://thedefimining.io/",
          body: `{\"code\":\"eosio.token\",\"account\":\"${this.$store.state.user.name}\",\"symbol\":\"WAX\"}`,
          method: "POST",
          mode: "cors",
        }
      )
        .then((x) => x.json())
        .then((y) => {
          if (y[0] == undefined) {
            this.$store.commit("user/setToken", {
              type: "WAX",
              value: "0.0000",
            });
          } else {
            this.$store.commit("user/setToken", {
              type: "WAX",
              value: y[0] != undefined ? y[0].split(" ")[0] : "0.0000",
            });
          }
        });
    },
  },
};
</script>
