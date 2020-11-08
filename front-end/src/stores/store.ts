import Vue from "vue"
import Vuex from "vuex"
import setting from "./setting/index"
import chat from "./chat/index"
import speech from "./speech/index"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    setting: setting,
    chat: chat,
    speech: speech
  }
})
