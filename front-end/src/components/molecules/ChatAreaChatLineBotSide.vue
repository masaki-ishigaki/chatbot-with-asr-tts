<template>
  <div class="m-bot-chat">
    <ChatAreaChatLineTextBallon
      v-if="ballonType === 'text'"
      class="m-bot-chat__res--text u-bkgcolor"
      :message="chat.message"
    />
    <ChatAreaChatLineLinkBallon
      v-else-if="ballonType === 'link'"
      class="m-bot-chat__res--text u-bkgcolor"
      :url="chat.message"
    />
    <ChatAreaChatLineImageBallon
      v-else-if="ballonType === 'image'"
      class="m-bot-chat__res--ref"
      :blob="chat.blobData"
    />
    <ChatAreaChatLineVideoBallon
      v-else-if="ballonType === 'video'"
      class="m-bot-chat__res--ref"
      :blob="chat.blobData"
    />
    <ChatAreaChatLineThinkingBallon
      v-else-if="ballonType === 'thinking'"
      class="m-bot-chat__res--text u-bkgcolor"
      :message="chat.message"
    />
    <ChatAreaChatLineListBallon
      v-else
      class="m-bot-chat__res--list"
      :selections="chat.selections"
      @on-click-list="onClickList"
    >
      <p>{{ headerTitle }}</p>
    </ChatAreaChatLineListBallon>
    <BaseYesNoBtn
      v-show="btnDisp && !isVUIUsed"
      class="m-bot-chat__btn"
      :btnType="'yes'"
      @on-click-yes-no="onClickYes"
    />
    <BaseYesNoBtn
      v-show="btnDisp && !isVUIUsed"
      class="m-bot-chat__btn"
      :btnType="'no'"
      @on-click-yes-no="onClickNo"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator"
import { ChatMessage } from "../../lib/types"
import { getCategoryTitle } from "../../lib/functions/category"
import { getBotBallonType } from "../../lib/functions/processSpeaker"
import Messages from "../../lib/messages"
import ChatAreaChatLineListBallon from "./ChatAreaChatLineListBallon.vue"
import ChatAreaChatLineTextBallon from "../atoms/ChatAreaChatLineTextBallon.vue"
import ChatAreaChatLineLinkBallon from "../atoms/ChatAreaChatLineLinkBallon.vue"
import ChatAreaChatLineImageBallon from "../atoms/ChatAreaChatLineImageBallon.vue"
import ChatAreaChatLineVideoBallon from "../atoms/ChatAreaChatLineVideoBallon.vue"
import ChatAreaChatLineThinkingBallon from "../atoms/ChatAreaChatLineThinkingBallon.vue"
import BaseYesNoBtn from "../atoms/BaseYesNoBtn.vue"
import * as Vuex from "vuex"

@Component({
  components: {
    ChatAreaChatLineListBallon,
    ChatAreaChatLineTextBallon,
    ChatAreaChatLineLinkBallon,
    ChatAreaChatLineImageBallon,
    ChatAreaChatLineVideoBallon,
    ChatAreaChatLineThinkingBallon,
    BaseYesNoBtn
  }
})
export default class BotChat extends Vue {
  $store!: Vuex.ExStore

  // Interfaces
  @Prop()
  chat!: ChatMessage

  // Computed Property
  category = ""
  headerTitle = ""
  btnDisp = false
  get ballonType(): string {
    let type = getBotBallonType(this.chat.speaker)

    if (this.chat.speaker === "bot-main-category") {
      this.category = "Main"
      this.headerTitle = "メイン"
    } else if (this.chat.speaker === "bot-sub-category") {
      this.category = "Sub"
      this.headerTitle = "サブ"
    } else if (this.chat.speaker === "bot-faq") {
      this.category = "Question"
      this.headerTitle = "質問選択肢"
    }

    return type
  }
  get parentCategoryID(): string {
    return this.$store.getters["chat/parentCategoryID"]
  }
  get isVUIUsed(): boolean {
    return this.$store.getters["setting/voiceUIMode"]
  }
  get isSpeaking(): boolean {
    return this.$store.getters["speech/speakingFlg"]
  }

  // Events (Watcher or Lifecycle Method)
  created() {
    if (this.chat.goToNextFlg === true) {
      this.btnDisp = true
    }
  }

  // Methods
  @Emit("main")
  selectMainCategory(id: string) {
    let mainCategoryID = id
    let mainCategoryTitle = ""
    if (this.chat.selections !== undefined) {
      mainCategoryTitle = getCategoryTitle(this.chat.selections, id)
    } else {
      throw new Error("Selections doesn't exist!!")
    }
    return [mainCategoryID, mainCategoryTitle]
  }
  @Emit("sub")
  selectSubCategory(id: string): [string, string, string] {
    let subCategoryID = id
    let subCategoryTitle = ""
    if (this.chat.selections !== undefined) {
      subCategoryTitle = getCategoryTitle(this.chat.selections, id)
    } else {
      throw new Error("Main Category isn't set!!")
    }
    return [this.parentCategoryID, subCategoryID, subCategoryTitle]
  }
  @Emit("questions")
  selectQuestions(id: string): string {
    if (this.chat.selections !== undefined) {
      return getCategoryTitle(this.chat.selections, id)
    } else {
      throw new Error("Selections doesn't exist!!")
    }
  }
  @Emit("others")
  selectOthers() {
    // This method is only for informing a parent component that the event has been triggered!!
  }
  @Emit("fail")
  selectFailed() {
    // This method is only for informing a parent component that the event has been triggered!!
  }
  @Emit()
  onClickList(id: string) {
    // Switcheds the event which is passed to the parent compornent
    // depending on the current category and selected list.
    if (id === "others") {
      this.selectOthers()
    } else if (id === "fail") {
      this.selectFailed()
    } else {
      if (this.category === "Main") {
        this.selectMainCategory(id)
      } else if (this.category === "Sub") {
        this.selectSubCategory(id)
      } else {
        this.selectQuestions(id)
      }
    }
  }
  @Emit()
  onClickYes() {
    this.btnDisp = false
  }
  @Emit()
  onClickNo() {
    this.btnDisp = false
  }
}
</script>

<style scoped lang="scss">
.m-bot-chat {
  display: flex;
  align-items: center;
  margin-left: 25px;
  height: 100%;
  &__res {
    &--text {
      border-radius: 0px 15px 15px 15px;
      box-shadow: 2px 2px #eeeeee;
    }
    &--list {
      border-radius: 0px 15px 15px 15px;
      box-shadow: 2px 2px #eeeeee;
      overflow: hidden;
    }
  }
  &__btn {
    margin-left: 2%;
    width: 10%;
    height: 40px;
    border-radius: 15px;
  }
}
@media screen and (max-width: 480px) {
  .m-bot-chat {
    margin-left: 10px;
    &__btn {
      height: 30px;
      border-radius: 10px;
    }
  }
}
.u-bkgcolor {
  background-color: white;
}
</style>
