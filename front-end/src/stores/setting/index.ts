import { Getters, Mutations, Actions } from "vuex"
import { S, G, M, A } from "./type"

export const state: S = {
  isLoaded: false,
  voiceUIMode: true
}

export const getters: Getters<S, G> = {
  isLoaded(state) {
    return state.isLoaded
  },
  voiceUIMode(state) {
    return state.voiceUIMode
  }
}

export const mutations: Mutations<S, M> = {
  setLoadingState(state, payload) {
    state.isLoaded = payload
  },
  changeVUIMode(state) {
    state.voiceUIMode = !state.voiceUIMode
  }
}

export const actions: Actions<S, A, G, M> = {
  changeLoadingState(ctx, payload) {
    ctx.commit("setLoadingState", payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
