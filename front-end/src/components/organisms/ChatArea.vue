<template>
  <div class="o-chat-area">
    <div class="o-chat-area__space"></div>
    <div class="o-chat-area__contents">
      <ChatAreaChatLine
        v-for="chat in chatLogs"
        :key="chat.id"
        :chat="chat"
        :speaker="chat.speaker"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator"
import { ChatMessage, Transcript } from "../../lib/types"
import {
  isScrollToBottom,
  canBotSpeak
} from "../../lib/functions/processSpeaker"
import ChatAreaChatLine from "./ChatAreaChatLine.vue"
import * as Vuex from "vuex"

@Component({
  components: {
    ChatAreaChatLine
  }
})
export default class ChatArea extends Vue {
  $store!: Vuex.ExStore

  // Local States
  prevScrollHeight = 0
  get chatLogs(): ChatMessage[] {
    return this.$store.getters["chat/chatLogs"]
  }
  get currentEmotion(): number {
    return this.$store.getters["chat/emotionType"]
  }
  get referenceIsLoaded(): boolean {
    return this.$store.getters["setting/isLoaded"]
  }
  get transcripts(): Array<Transcript> {
    return this.$store.getters["speech/transcripts"]
  }
  get isFirstRecog(): boolean {
    return this.$store.getters["speech/isFirstRecog"]
  }

  // Events (Watcher or Lifecycle Method)
  @Watch("chatLogs")
  onChatLogsChanged() {
    this.$nextTick(() => {
      let index: number = this.chatLogs.length - 1
      let lastChat: ChatMessage = this.chatLogs[index]
      this.autoScroll(lastChat.speaker)
      if (canBotSpeak(lastChat.speaker)) {
        this.botSpeak(lastChat)
      }
    })
  }
  @Watch("referenceIsLoaded")
  onLoaded(newItem: boolean, oldItem: boolean) {
    if (newItem === true) {
      let lastSpeaker: string = this.chatLogs[this.chatLogs.length - 1].speaker
      this.autoScroll(lastSpeaker)
      this.$store.dispatch("setting/changeLoadingState", false)
    }
  }
  @Watch("transcripts")
  onStartRecognition(value: Array<Transcript>) {
    if (this.transcripts[0].text !== "") {
      if (this.isFirstRecog) {
        // Add the user ballon in the chat area
        let tmp: ChatMessage = {
          speaker: "user",
          message: "",
          transcripts: value
        }
        this.$store.dispatch("chat/addChatMessage", tmp)
        this.$store.dispatch("speech/disableIsFirstRecog")
      } else {
        this.$store.dispatch("chat/updateTranscripts", value)
      }
    }
  }

  // Methods
  autoScroll(lastSpeaker: string) {
    const target: HTMLElement | null = document.querySelector(
      ".o-chat-area__contents"
    )
    if (target === null) {
      return
    }
    let scrollTop: number
    if (lastSpeaker === "user") {
      let userList: NodeListOf<Element> = target.querySelectorAll(
        ".m-user-chat"
      )
      let userHeight: number =
        userList.length > 0
          ? (userList[userList.length - 1] as HTMLElement).offsetHeight
          : 0
      this.prevScrollHeight = target.scrollHeight - userHeight - 30
      scrollTop = this.prevScrollHeight
    } else if (isScrollToBottom(lastSpeaker)) {
      scrollTop = target.scrollHeight
    } else {
      if (target.querySelectorAll(".m-user-chat").length === 0) {
        scrollTop = target.scrollHeight
      } else {
        scrollTop = this.prevScrollHeight
      }
    }
    target.scrollTop = scrollTop
  }
  botSpeak(lastChat: ChatMessage) {
    let spokenText = ""

    this.$store.commit("speech/enqueueSpokenText", spokenText)

    if (lastChat.speaker === "bot-byebye") {
      this.$store.dispatch("speech/sayGoodbye")
      return
    }

    if (this.$store.getters["speech/speakingFlg"] === false) {
      this.$store.dispatch("speech/startSpeaking")
    }
  }
}
</script>

<style scoped lang="scss">
$chatarea-color: #fffceb;

.o-chat-area {
  width: 100%;
  min-width: 330px;
  height: 100%;
  background-color: $chatarea-color;
  &__space {
    content: "";
    display: block;
    width: 97%;
    height: 12%;
    background-color: $chatarea-color;
    position: absolute;
    opacity: 1;
    z-index: 1;
  }
  &__contents {
    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 12%;
    }
    height: 100%;
    padding-bottom: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    z-index: 2;
    &::-webkit-scrollbar-thumb {
      border-color: $chatarea-color;
    }
  }
}
@media screen and (min-width: 1050px) {
  .o-chat-area {
    width: 1050px;
    margin: 0 auto;
    &__space {
      width: 1042px;
      height: 15%;
    }
    &__contents {
      &::before {
        height: 15%;
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .o-chat-area {
    &__space {
      height: 5%;
    }
    &__contents {
      &::before {
        height: 10%;
      }
    }
  }
}
</style>
