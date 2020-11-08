import Vue from "vue"
import App from "./App.vue"
import store from "./stores/store"
import Buefy from "buefy"
import "buefy/dist/buefy.css"

import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faMicrophone,
  faBars,
  faTimes,
  faPaperPlane,
  faStopCircle,
  faLanguage,
  faToggleOn,
  faToggleOff
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
library.add(
  faMicrophone,
  faBars,
  faTimes,
  faPaperPlane,
  faStopCircle,
  faLanguage,
  faToggleOn,
  faToggleOff
)
Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.component("vue-fontawesome", FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas"
})

require("@/assets/scss/style.scss")

new Vue({
  store,
  render: (h) => h(App)
}).$mount("#app")
