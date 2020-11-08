<template>
  <div class="o-input">
    <div class="o-input__form">
      <InputAreaTextInputForm
        ref="input"
        v-show="!isVoiceUIUsed && !recordingFlg"
        class="o-input__form__text"
        :disableFlg="inputDisableFlg"
        @input-text="submit"
      />
      <p v-show="recordingFlg" class="o-input__form__text o-notification">
        {{ pleaseSpeakMsg }}
      </p>
      <InputAreaSendBtn
        v-show="!isVoiceUIUsed"
        class="o-input__form__send"
        :disableFlg="inputDisableFlg || recordingFlg"
        @on-click="submit"
      />
      <InputAreaMicBtn
        v-show="!isVoiceUIUsed"
        class="o-input__form__mic"
        :disableFlg="inputDisableFlg"
        @recognize="recognize"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator"
import Messages from "../../lib/messages"
import {
  selectMainCategoryViaVoice,
  selectSubCategoryViaVoice,
  isNotInAboveSelected
} from "../../lib/functions/voiceUI"
import InputAreaTextInputForm from "../atoms/InputAreaTextInputForm.vue"
import InputAreaSendBtn from "../atoms/InputAreaSendBtn.vue"
import InputAreaMicBtn from "../atoms/InputAreaMicBtn.vue"
import * as Vuex from "vuex"

@Component({
  components: {
    InputAreaTextInputForm,
    InputAreaSendBtn,
    InputAreaMicBtn
  }
})
export default class InputArea extends Vue {
  $store!: Vuex.ExStore

  // Interfaces
  @Prop()
  disableFlg!: boolean

  // Local States
  pleaseSpeakMsg = "何か話して！！"
  get refs(): any {
    return this.$refs.input
  }
  get chatLogs() {
    return this.$store.getters["chat/chatLogs"]
  }
  get parentCategoryID() {
    return this.$store.getters["chat/parentCategoryID"]
  }
  get inputDisableFlg(): boolean {
    return this.$store.getters["chat/inputDisableFlg"]
  }
  get currentTopic(): string {
    return this.$store.getters["chat/topic"]
  }
  get isVoiceUIUsed(): boolean {
    return this.$store.getters["setting/voiceUIMode"]
  }
  get recordingFlg(): boolean {
    return this.$store.getters["speech/recordingFlg"]
  }
  get isSpeaking(): boolean {
    return this.$store.getters["speech/speakingFlg"]
  }

  // Events (Watcher or Lifecycle Method)
  @Watch("recordingFlg")
  onChangeRecordingFlg(newValue: boolean) {
    if (newValue === false && this.isVoiceUIUsed) {
      let transcripts = this.chatLogs[this.chatLogs.length - 1].transcripts
      let queryMessage = ""
      if (transcripts !== undefined && transcripts.length !== 0) {
        queryMessage = transcripts[0].text
        for (let i = 1; i < transcripts.length; i++) {
          queryMessage = queryMessage + "\n" + transcripts[i].text
        }
      }

      this.$store.dispatch("chat/askToDialogflow", queryMessage)
    }
  }

  // Methods
  submit() {
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }
    let message: string = this.refs.message
    if (message !== "") {
      this.refs.message = ""

      this.$store.dispatch("chat/submit", message)
    } else {
      window.alert("質問文が空白です。")
    }
  }
  recognize() {
    if (!this.recordingFlg) {
      if (this.isSpeaking === true) {
        this.$store.dispatch("speech/stopSpeaking")
      }
      this.$store.dispatch("speech/startRecognition")
    } else {
      this.$store.dispatch("speech/stopRecognition")
      let transcripts = this.chatLogs[this.chatLogs.length - 1].transcripts
      let queryMessage = ""
      if (transcripts !== undefined && transcripts.length !== 0) {
        queryMessage = transcripts[0].text
        for (let i = 1; i < transcripts.length; i++) {
          queryMessage = queryMessage + "\n" + transcripts[i].text
        }
      }

      if (queryMessage !== "") {
        this.$store.dispatch("chat/makeInputAreaDisable", true)
        this.$store.dispatch("chat/askToDialogflow", queryMessage)
      }
    }
  }
}
</script>

<style scoped lang="scss">
$btnwidth: 60px;
.o-input {
  width: 100%;
  height: 100%;
  background-color: rgb(237, 237, 237);
  &__form {
    display: flex;
    width: 100%;
    height: 100%;
    &__text {
      width: calc(100% - #{$btnwidth});
      margin-top: 10px;
      margin-bottom: 10px;
      margin-left: 25px;
    }
    &__send {
      width: $btnwidth;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    &__mic {
      width: $btnwidth;
      margin-top: 10px;
      margin-bottom: 10px;
      margin-right: 25px;
    }
  }
}
@media screen and (min-width: 1050px) {
  .o-input__form {
    width: 1050px;
    margin: 0 auto;
  }
}
@media screen and (max-width: 480px) {
  .o-input__form {
    &__text {
      margin-left: 10px;
    }
    &__send {
      margin-right: 10px;
    }
  }
}

.o-notification {
  line-height: 50px;
  color: #3cb371;
  font-weight: bold;
  animation: flash 2s linear infinite;
}
@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
