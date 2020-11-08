<template>
  <div class="m-user-chat">
    <ChatAreaChatLineTextBallon
      v-if="isTextBallon"
      class="m-user-chat__ballon u-bkgcolor"
      :message="chat.message"
    >
    </ChatAreaChatLineTextBallon>
    <ChatAreaChatLineRecognitionBallon
      v-else
      class="m-user-chat__ballon u-bkgcolor u-padding"
      :transcripts="chat.transcripts"
    >
    </ChatAreaChatLineRecognitionBallon>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { ChatMessage } from "../../lib/types"
import ChatAreaChatLineTextBallon from "../atoms/ChatAreaChatLineTextBallon.vue"
import ChatAreaChatLineRecognitionBallon from "../atoms/ChatAreaChatLineRecognitionBallon.vue"

@Component({
  components: {
    ChatAreaChatLineTextBallon,
    ChatAreaChatLineRecognitionBallon
  }
})
export default class UserChat extends Vue {
  // Data Property
  @Prop()
  chat!: ChatMessage
  isTextBallon = true

  // Lifecycle hooks
  created() {
    if (
      this.chat.transcripts === undefined ||
      this.chat.transcripts.length === 0
    ) {
      this.isTextBallon = true
    } else {
      this.isTextBallon = false
    }
  }
}
</script>

<style scoped lang="scss">
.m-user-chat {
  margin-right: 25px;
  display: flex;
  justify-content: flex-end;
  &__ballon {
    border-radius: 15px 0px 15px 15px;
    box-shadow: 2px 2px #eeeeee;
  }
}
@media screen and (max-width: 480px) {
  .m-user-chat {
    margin-right: 10px;
  }
}
.u-bkgcolor {
  background-color: #7b84db;
}
.u-padding {
  &::before,
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 7px;
  }
}
</style>
