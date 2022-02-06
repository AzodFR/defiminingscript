import * as waxjs from "@waxio/waxjs/dist";

export const state = () => ({
  name: "",
  energy: 0,
  stake: 0,
  cpu: 0,
  lock: false,
  actions: [],
  r_actions: [],
  retry: [],
  autoclaim: {
    "rigs": {
      "global": false,
    },
    "elecsources": {
      "global": false
    },
    "workshops": {
      "global": false
    }
  },
  autorepair: {
    "rigs": {
      "global": false,
    },
    "elecsources": {
      "global": false
    },
    "workshops": {
      "global": false
    }
  },
  tokens: {
    "WAX": 0,
    "DMC": 0,
    "DME": 0,
    "DMT": 0
  },
  production: {
    "DMC": 0,
    "DME": 0,
    "DMT": 0
  },
  cost: {
    "DMC": 0,
    "DME": 0,
    "DMT": 0
  },
  logged_asset: [],
  ressources: {
    "DMC": 0,
    "DME": 0,
    "DMT": 0
  },
  wax: null,
  items: {
    "rigs": [],
    "elecsources": [],
    "workshops": []
  },
  templates: []
})

export const mutations = {
  async login(state, rpc) {
    state.wax = new waxjs.WaxJS({
      rpcEndpoint: rpc,
      tryAutoLogin: true
    })
    await state.wax.login()
  },
  setUser(state) {
    state.name = state.wax.userAccount
    // state.name = "uvhvw.wam"
  },
  setToken(state, token) {
    state.tokens[token.type] = token.value
  },
  setRessource(state, token) {
    state.ressources[token.type] = token.value
  },
  setEnergy(state, value) {
    state.energy = value
  },
  setItem(state, item) {
    state.items[item.type] = item.value;
  },
  setTemplates(state, value) {
    state.templates = value
  },
  setAutoClaim(state, param) {
    state.autoclaim[param.type][param.id] = param.value;
  },
  setAutoRepair(state, param) {
    state.autorepair[param.type][param.id] = param.value;
  },
  addProduction(state, param) {
    state.production[param.type] += param.value;
  },
  addCost(state, param) {
    state.cost[param.type] += param.value;
  },
  addAsset(state, id) {
    state.logged_asset.push(id);
  },
  setLock(state, value) {
    state.lock = value;
  },
  setStake(state, value) {
    state.stake = value;
  },
  setCPU(state, value) {
    state.cpu = value;
  },
  addAction(state, action) {
    state.actions.push(action)
  },
  addRAction(state, r_action) {
    state.r_actions.push(r_action);
  },
  addRetryAction(state, action) {
    state.retry.push(action);
  },
  rmAction(state, action) {
    let idx = state.actions.indexOf(action);
    if (idx !== -1) {
      state.actions.splice(idx, 1);
    }
  },
  rmRAction(state, r_action) {
    let idx = state.r_actions.indexOf(r_action);
    if (idx !== -1) {
      state.r_actions.splice(idx, 1);
    }
  },
  rmRetryAction(state, action) {
    let idx = state.retry.indexOf(action);
    if (idx !== -1) {
      state.retry.splice(idx, 1);
    }
  }

}


export const getters = {
  getState(state) {
    return state
  }
}
