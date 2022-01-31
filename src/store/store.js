import { defineStore } from 'pinia'
import * as waxjs from "@waxio/waxjs/dist";

export const useUserStore = defineStore('userStore', {
    state: () => {
        return {
            wax: new waxjs.WaxJS({
                rpcEndpoint: "https://wax.greymass.com",
                tryAutoLogin: true
            }),
            name: '',
            rigs: [],
            solar: [],
            workshops: [],
            templates: [],
            ig_rss: [],
            dmt: "",
            dme: ""
        }
    },
    actions: {
        login: async function () {
            this.name = await this.wax.login()
            this.fetchTemplate()
            this.fetchDME()
            this.fetchDMT()
            setInterval(async () => {
                this.fetchSolar()
                this.fetchRig()
                this.fetchWrk()
                this.fetchUser()
            }, 1000)
            
        },
        fetchTemplate: async function () {
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
                body: `{\"json\":true,\"code\":\"defiminingio\",\"scope\":\"defiminingio\",\"table\":\"templates\",\"table_key\":\"\",\"lower_bound\":\"\",\"upper_bound\":\"\",\"limit\":\"100\",\"reverse\":false,\"show_payer\":false}`,
                method: "POST",
                mode: "cors",
            }).then(x => x.json()).then(y => {
                this.templates = y.rows;
            })
        },
        findInTemplate: function (id) {
            let template;
            this.templates.forEach(elem => {
                if (elem.template_id == id) {
                    template = elem
                }
            })
            return template
        },
        fetchDME: async function () {
            await fetch("https://wax.greymass.com/v1/chain/get_currency_balance", {
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
                body: `{\"code\":\"defiminingtk\",\"account\":\"${this.name}\",\"symbol\":\"DME\"}`,
                method: "POST",
                mode: "cors",
            }).then(x => x.json()).then(y => this.dme = y[0])
        },
        fetchDMT: async function () {
            await fetch("https://wax.greymass.com/v1/chain/get_currency_balance", {
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
                body: `{\"code\":\"defiminingtk\",\"account\":\"${this.name}\",\"symbol\":\"DMT\"}`,
                method: "POST",
                mode: "cors",
            }).then(x => x.json()).then(y => this.dmt = y[0])
        },
        fetchUser: async function () {
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
                body: `{\"json\":true,\"code\":\"defiminingio\",\"scope\":\"defiminingio\",\"table\":\"users\",\"table_key\":\"\",\"lower_bound\":\"${this.name}\",\"upper_bound\":\"${this.name}\",\"limit\":\"100\",\"reverse\":false,\"show_payer\":false}`,
                method: "POST",
                mode: "cors",
            }).then(x => x.json()).then(user => {
                this.ig_rss[0] = user.rows[0].balance_dme / 10000 + " DME"
                this.ig_rss[1] = user.rows[0].balance_dmt / 10000 + " DMT"
                this.ig_rss[2] = user.rows[0].balance_dmc / 10000 + " DMC"
            })
        },
        fetchSolar: async function () {
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
                body: `{\"json\":true,\"code\":\"defiminingio\",\"scope\":\"defiminingio\",\"table\":\"elecsources\",\"table_key\":\"\",\"lower_bound\":\"${this.name}\",\"upper_bound\":\"${this.name}\",\"index_position\":2,\"key_type\":\"i64\",\"limit\":\"100\",\"reverse\":false,\"show_payer\":false}`,
                method: "POST",
                mode: "cors",
            }).then(x => x.json()).then(panel => {
                let newSolar = []
                panel.rows.forEach(async elem => {
                    elem.img = this.findInTemplate(elem.template_id).img
                    if (elem.current_durability < elem.durability / 2) {
                        const results = await this.wax.api.transact({
                            actions: [{
                                account: 'defiminingio',
                                name: 'repairelec',
                                authorization: [{
                                    actor: this.wax.userAccount,
                                    permission: 'active',
                                }],
                                data: {
                                    to: this.wax.userAccount,
                                    asset_id: elem.asset_id
                                },
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 1200,
                        });
                        console.log(results)
                    }
                    if (elem.claim_time * 1000 < Date.now()) {
                        elem.claim = "Claim !"
                        const result = await this.wax.api.transact({
                            actions: [{
                                account: 'defiminingio',
                                name: 'claimelec',
                                authorization: [{
                                    actor: this.wax.userAccount,
                                    permission: 'active',
                                }],
                                data: {
                                    to: this.wax.userAccount,
                                    asset_id: elem.asset_id
                                },
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 1200,
                        });
                        console.log(result)
                    }
                    else {
                        const time = new Date(elem.claim_time * 1000 - Date.now())
                        const Hours = time.getHours() > 10 ? time.getHours() : "0" + time.getHours()
                        const Minutes = time.getMinutes() > 10 ? time.getMinutes() : "0" + time.getMinutes()
                        const Seconds = time.getSeconds() > 10 ? time.getSeconds() : "0" + time.getSeconds()
                        elem.claim = Hours + ":" + Minutes + ":" + Seconds;
                    }
                    newSolar.push(elem)
                })
                this.solar = newSolar;
            })
        },
        fetchRig: async function () {
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
                body: `{\"json\":true,\"code\":\"defiminingio\",\"scope\":\"defiminingio\",\"table\":\"rigs\",\"table_key\":\"\",\"lower_bound\":\"${this.name}\",\"upper_bound\":\"${this.name}\",\"index_position\":2,\"key_type\":\"i64\",\"limit\":\"100\",\"reverse\":false,\"show_payer\":false}`,
                method: "POST",
                mode: "cors",
            }).then(x => x.json()).then(panel => {
                let newRigs = []
                panel.rows.forEach(async elem => {
                    elem.img = this.findInTemplate(elem.template_id).img
                    if (elem.current_durability < elem.durability / 2) {
                        const results = await this.wax.api.transact({
                            actions: [{
                                account: 'defiminingio',
                                name: 'repairrig',
                                authorization: [{
                                    actor: this.wax.userAccount,
                                    permission: 'active',
                                }],
                                data: {
                                    to: this.wax.userAccount,
                                    asset_id: elem.asset_id
                                },
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 1200,
                        });
                        console.log(results)
                    }
                    if (elem.claim_time * 1000 < Date.now()) {
                        elem.claim = "Claim !"
                        const result = await this.wax.api.transact({
                            actions: [{
                                account: 'defiminingio',
                                name: 'claimrig',
                                authorization: [{
                                    actor: this.wax.userAccount,
                                    permission: 'active',
                                }],
                                data: {
                                    to: this.wax.userAccount,
                                    asset_id: elem.asset_id
                                },
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 1200,
                        });
                        console.log(result)
                    }
                    else {
                        const time = new Date(elem.claim_time * 1000 - Date.now())
                        const Hours = time.getHours() > 10 ? time.getHours() : "0" + time.getHours()
                        const Minutes = time.getMinutes() > 10 ? time.getMinutes() : "0" + time.getMinutes()
                        const Seconds = time.getSeconds() > 10 ? time.getSeconds() : "0" + time.getSeconds()
                        elem.claim = Hours + ":" + Minutes + ":" + Seconds;
                    }
                    newRigs.push(elem)
                })
                this.rigs = newRigs;
            })
        },
        fetchWrk: async function () {
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
                body: `{\"json\":true,\"code\":\"defiminingio\",\"scope\":\"defiminingio\",\"table\":\"workshops\",\"table_key\":\"\",\"lower_bound\":\"${this.name}\",\"upper_bound\":\"${this.name}\",\"index_position\":2,\"key_type\":\"i64\",\"limit\":\"100\",\"reverse\":false,\"show_payer\":false}`,
                method: "POST",
                mode: "cors",
            }).then(x => x.json()).then(panel => {
                let newwrk = []
                panel.rows.forEach(async elem => {
                    elem.img = this.findInTemplate(elem.template_id).img
                    if (elem.current_durability < elem.durability / 2) {
                        const results = await this.wax.api.transact({
                            actions: [{
                                account: 'defiminingio',
                                name: 'repaiws',
                                authorization: [{
                                    actor: this.wax.userAccount,
                                    permission: 'active',
                                }],
                                data: {
                                    to: this.wax.userAccount,
                                    asset_id: elem.asset_id
                                },
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 1200,
                        });
                        console.log(results)
                    }
                    if (elem.claim_time * 1000 < Date.now()) {
                        elem.claim = "Claim !"
                        const result = await this.wax.api.transact({
                            actions: [{
                                account: 'defiminingio',
                                name: 'claimdmc',
                                authorization: [{
                                    actor: this.wax.userAccount,
                                    permission: 'active',
                                }],
                                data: {
                                    username: this.wax.userAccount,
                                },
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 1200,
                        });
                        console.log(result)
                    }
                    else {
                        const time = new Date(elem.claim_time * 1000 - Date.now())
                        const Hours = time.getHours() > 10 ? time.getHours() : "0" + time.getHours()
                        const Minutes = time.getMinutes() > 10 ? time.getMinutes() : "0" + time.getMinutes()
                        const Seconds = time.getSeconds() > 10 ? time.getSeconds() : "0" + time.getSeconds()
                        elem.claim = Hours + ":" + Minutes + ":" + Seconds;
                    }
                    newwrk.push(elem)
                })
                this.workshops = newwrk;
            })
        }
    }
})