<template>
  <div id="app">
    <!--When the menu button is NOT being pressed-->
    <div class="p-content">
      <!--Character Component including bot image, stamp and animation-->
      <CharacterArea class="p-character" />

      <!--Header Component including Menu Button-->
      <header class="p-header">
        <HeaderArea />
      </header>

      <!--ChatArea Component-->
      <main class="p-view">
        <ChatArea />
      </main>

      <!--InputArea or BackToChat Component-->
      <footer class="p-footer">
        <InputArea />
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator"
import HeaderArea from "./components/organisms/HeaderArea.vue"
import CharacterArea from "./components/organisms/CharacterArea.vue"
import ChatArea from "./components/organisms/ChatArea.vue"
import InputArea from "./components/organisms/InputArea.vue"
import * as Vuex from "vuex"

@Component({
  components: {
    HeaderArea,
    CharacterArea,
    ChatArea,
    InputArea
  }
})
export default class App extends Vue {
  $store!: Vuex.ExStore

  // Local States
  isActive = false
  isParamSet = false
  inputDispFlg = true

  // Events (Watcher or Lifecycle Method)
  mounted() {
    let welcomeMsg = new Promise<string>((resolve) => {
      setTimeout(() => {
        this.$store.dispatch("chat/createDefaultMessage", "welcome")
        resolve("Create Welcome Message!!")
      }, 500)
    })
  }

  // Methods
  closeMenu(result: string) {
    if (result === "OK") {
      this.isParamSet = true
      this.isActive = false
    }
  }
}
</script>

<style lang="scss">
body {
  &::-webkit-scrollbar {
    display: none;
  }
}

// Layout of the entire page
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Noto Sans JP", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro",
    "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 98, 178);
  position: relative;
}

// Style when switching modal window
.p-content {
  width: 100%;
  height: 100%;
  &.is-active {
    pointer-events: none;
    transition: all 0.2s ease-out;
    -webkit-filter: blur(8px);
    -moz-filter: blur(8px);
    -ms-filter: blur(8px);
    filter: blur(8px);
  }
}
.p-modalwindow {
  width: 100%;
  height: 100%;
  background-color: rgba(50, 47, 45, 0.5);
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.2s ease-out;
  pointer-events: none;
  &.is-active {
    opacity: 1;
    pointer-events: auto;
  }
  &--dialog {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: flex-end;
    transition: all 0.2s ease-out;
  }
}

// Style of each component
$header-grad-yellow: #fff581;
$header-grad-pink: #ffabab;
$header-grad-blue: #65c3ff;

.p-character {
  top: 60px;
  position: absolute;
  z-index: 3;
}
@media screen and (max-width: 480px) {
  .p-character {
    top: 40px;
  }
}

.p-header {
  width: 100%;
  height: var(--header-height);
  background-color: rgb(255, 255, 255);
  border-bottom: 3px solid #eeeeee;
  position: relative;
  z-index: 1;
  &::before {
    content: "";
    display: block;
    height: 3px;
    background: linear-gradient(
      to right,
      $header-grad-yellow 0,
      $header-grad-pink 50%,
      $header-grad-blue 100%
    );
  }
}

.p-view {
  width: 100%;
  height: calc(100% - var(--header-height) - var(--footer-height) + 5px);
  position: relative;
  z-index: 0;
}

.p-footer {
  width: 100%;
  height: var(--footer-height);
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
