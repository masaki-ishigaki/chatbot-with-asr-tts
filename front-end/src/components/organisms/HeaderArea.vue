<template>
  <div class="o-header">
    <div class="o-header__logo">
      <p>Demo Chatbot</p>
    </div>
    <div class="o-header__toggle">
      <HeaderAreaToggle
        class="o-header__toggle__btn"
        :isToggleON="isVoiceUIUsed"
        @toggle="changeVUIMode"
      />
      <div class="o-header__toggle__text">
        <p>Voice UI Mode</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import HeaderAreaToggle from "../atoms/HeaderAreaToggle.vue"
import * as Vuex from "vuex"

@Component({
  components: {
    HeaderAreaToggle
  }
})
export default class HeaderArea extends Vue {
  $store!: Vuex.ExStore

  // Local States
  get isVoiceUIUsed(): boolean {
    return this.$store.getters["setting/voiceUIMode"]
  }
  get isSpeaking(): boolean {
    return this.$store.getters["speech/speakingFlg"]
  }
  get isRecording(): boolean {
    return this.$store.getters["speech/recordingFlg"]
  }

  // Methods
  changeVUIMode() {
    this.$store.commit("setting/changeVUIMode")
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }

    if (this.isRecording === true) {
      this.$store.dispatch("speech/stopRecognition")
    }

    if (this.$store.getters["setting/voiceUIMode"]) {
      this.$store.dispatch("speech/startRecognition")
    }
  }
}
</script>

<style scoped lang="scss">
.o-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &__logo {
    padding-top: 13px;
    padding-left: 25px;
    padding-bottom: 10px;
    img {
      height: 40px;
      width: auto;
    }
  }
  &__toggle {
    margin-left: auto;
    margin-right: 15px;
    width: 200px;
    height: 40px;
    display: flex;
    &__btn {
      width: 60px;
    }
    &__text {
      width: 140px;
      display: flex;
      align-items: center;
      p {
        padding-left: 10px;
      }
    }
  }
}
@media screen and (min-width: 1050px) {
  .o-header {
    width: 1050px;
    margin: 0 auto;
  }
}
@media screen and (max-width: 480px) {
  .o-header {
    &__logo {
      padding-left: 13px;
      img {
        height: 25px;
      }
    }
    &__btn {
      width: 65px;
      transform: translateY(-2px);
    }
  }
}
</style>
