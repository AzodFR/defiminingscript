import { defineStore } from 'pinia'
import * as waxjs from "@waxio/waxjs/dist";

export const useUserStore = defineStore('userStore', {
    state: () => {
        return {
            wax: new waxjs.WaxJS({
                rpcEndpoint: "https://api.wax.greeneosio.com",
                tryAutoLogin: true
            }),
            name: '',
            rigs: [],
            solar: [],
            workshops: [],
            templates: [],
            ig_rss: [],
            dmt: "",
            dme: "",
            assets: []
        }
    },
    actions: {
        login: async function () {
            this.name = await this.wax.login()
            await this.fetchTemplate()
            this.fetchDME()
            this.fetchDMT()
            setInterval(async () => {
                this.fetchSolar()
                this.fetchRig()
                this.fetchWrk()
                this.fetchUser()
            }, 1000)
            setInterval(async () => {
                this.repair()
                this.claim()
            }, 2000)
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
            }).then(x => x.json()).then(async panel => {
                console.log(panel.rows)
                let newSolar = []
                await panel.rows.forEach(async elem => {
                    elem.img = this.findInTemplate(elem.template_id).img
                    if ((elem.claim_time) * 1000 < (Date.now())) {
                        elem.claim = "Claim !"
                    }
                    else {
                        const time = new Date((elem.claim_time) * 1000 - (Date.now()) - 3600000)
                        const Hours = time.getHours() >= 10 ? time.getHours() : "0" + time.getHours()
                        const Minutes = time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()
                        const Seconds = time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds()
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
            }).then(x => x.json()).then(async panel => {
                let newRigs = []
                await panel.rows.forEach(async elem => {
                    elem.img = this.findInTemplate(elem.template_id).img
                    if ((elem.claim_time) * 1000 < Date.now()) {
                        elem.claim = "Claim !"

                    }
                    else {
                        const time = new Date((elem.claim_time) * 1000 - (Date.now()) - 3600000)
                        const Hours = time.getHours() >= 10 ? time.getHours() : "0" + time.getHours()
                        const Minutes = time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()
                        const Seconds = time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds()
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
            }).then(x => x.json()).then(async panel => {
                let newwrk = []
                await panel.rows.forEach(async elem => {
                    elem.img = this.findInTemplate(elem.template_id).img

                    if ((elem.claim_time) * 1000 < (Date.now())) {
                        elem.claim = "Claim !"
                    }
                    else {
                        const time = new Date((elem.claim_time) * 1000 - (Date.now()) - 3600000)
                        const Hours = time.getHours() >= 10 ? time.getHours() : "0" + time.getHours()
                        const Minutes = time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()
                        const Seconds = time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds()
                        elem.claim = Hours + ":" + Minutes + ":" + Seconds;
                    }
                    newwrk.push(elem)
                })
                this.workshops = newwrk;
            })
        },
        claim: async function () {
            await this.solar.forEach(async elem => {
                if (elem.claim == "Claim !") {
                    if (!this.assets.includes(elem.asset_id)) {
                        this.assets.push(elem.asset_id)
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
                        this.assets.map(x => x != elem.asset_id)
                    }
                }
            })
            await this.rigs.forEach(async elem => {
                if (elem.claim == "Claim !") {
                    if (!this.assets.includes(elem.asset_id)) {
                        this.assets.push(elem.asset_id)
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
                        this.assets.map(x => x != elem.asset_id)
                    }
                }
            })
            await this.workshops.forEach(async elem => {
                if (elem.claim == "Claim !") {
                    if (!this.assets.includes(elem.asset_id)) {
                        this.assets.push(elem.asset_id)
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
                        this.assets.map(x => x != elem.asset_id)
                    }
                }
            })
        },
        repair: async function () {
            await this.solar.forEach(async elem => {
                if (elem.current_durability < elem.durability / 2) {
                    if (!this.assets.includes(elem.asset_id)) {
                        this.assets.push(elem.asset_id)
                        await this.wax.api.transact({
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

                        this.assets.map(x => x != elem.asset_id)
                    }
                }
            })
            await this.rigs.forEach(async elem => {
                if (elem.current_durability < elem.durability / 2) {
                    if (!this.assets.includes(elem.asset_id)) {
                        this.assets.push(elem.asset_id)
                        await this.wax.api.transact({
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

                        this.assets.map(x => x != elem.asset_id)
                    }
                }
            })
            await this.workshops.forEach(async elem => {
                if (elem.current_durability < elem.durability / 2) {
                    if (!this.assets.includes(elem.asset_id)) {
                        this.assets.push(elem.asset_id)
                    await this.wax.api.transact({
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
                        this.assets.map(x => x != elem.asset_id)
                    }
                }
            })
        }
    }
})