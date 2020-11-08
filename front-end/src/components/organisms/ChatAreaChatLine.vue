<template>
  <div class="o-chat-line">
    <ChatAreaChatLineUserSide v-if="chat.speaker === 'user'" :chat="chat" />
    <ChatAreaChatLineBotSide
      v-else
      :chat="chat"
      @main="selectMainCategory"
      @sub="selectSubCategory"
      @questions="selectQuestions"
      @others="selectOthers"
      @on-click-yes="resumeChat"
      @on-click-no="finishChat"
      @fail="selectFail"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { ChatMessage } from "../../lib/types"
import ChatAreaChatLineUserSide from "../molecules/ChatAreaChatLineUserSide.vue"
import ChatAreaChatLineBotSide from "../molecules/ChatAreaChatLineBotSide.vue"
import * as Vuex from "vuex"

@Component({
  components: {
    ChatAreaChatLineUserSide,
    ChatAreaChatLineBotSide
  }
})
export default class ChatAreaChatLine extends Vue {
  $store!: Vuex.ExStore

  // Interfaces
  @Prop()
  chat!: ChatMessage

  // Local States
  get isSpeaking(): boolean {
    return this.$store.getters["speech/speakingFlg"]
  }

  // Methods
  selectMainCategory(id: [string, string]) {
    this.$store.dispatch("chat/selectMainCategory", {
      categoryType: id,
      needUserBallon: true
    })
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }
  }
  selectSubCategory(id: [string, string, string]) {
    this.$store.dispatch("chat/selectSubCategory", {
      categoryType: id,
      needUserBallon: true
    })
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }
  }
  selectQuestions(message: string) {
    this.$store.dispatch("chat/submit", message)
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }
  }
  selectOthers() {
    this.$store.dispatch("chat/createDefaultMessage", "others-is-selected")
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }
  }
  selectFail() {
    this.$store.dispatch("chat/createDefaultMessage", "failed-to-guide")
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }
  }
  resumeChat() {
    this.$store.dispatch("chat/displayQuestionSelect", "next-query")
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }
  }
  finishChat() {
    this.$store.dispatch("chat/createDefaultMessage", "goodbye")
    if (this.isSpeaking === true) {
      this.$store.dispatch("speech/stopSpeaking")
    }
  }
}
</script>

<style scoped lang="scss">
.o-chat-line {
  margin: 20px 0;
}
</style>
