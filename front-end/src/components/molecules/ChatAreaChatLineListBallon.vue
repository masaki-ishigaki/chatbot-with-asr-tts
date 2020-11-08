<template>
  <transition appear name="fade-in">
    <ul class="m-table-list u-fontcolor">
      <li class="m-table-list__first u-header-bkgcolor">
        <img
          class="m-table-list__first__image"
          src="../../assets/images/question.png"
          alt="Question Logo"
        />
        <div class="m-table-list__first__text"><slot>タイトル</slot></div>
      </li>
      <li
        v-for="selection in selections"
        class="m-table-list__others u-list-bkgcolor"
        :key="selection.id"
      >
        <ChatAreaChatLineListBallonBtn
          :disableFlg="disableFlg"
          :selection="selection"
          @on-click-list="onClickList"
        />
      </li>
    </ul>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator"
import { Selection } from "../../lib/types"
import ChatAreaChatLineListBallonBtn from "../atoms/ChatAreaChatLineListBallonBtn.vue"

@Component({
  components: {
    ChatAreaChatLineListBallonBtn
  }
})
export default class ChatAreaChatLineListBallon extends Vue {
  // Interfaces
  @Prop()
  selections!: Array<Selection>

  // Local States
  dispFlg = false
  disableFlg = false

  // Methods
  @Emit()
  onClickList(id: string) {
    this.disableFlg = true
    return id
  }
}
</script>

<style lang="scss">
.m-table-list {
  max-width: 80%;
  white-space: pre-wrap;
  word-wrap: break-word;
  &__first {
    display: flex;
    align-items: center;
    &__image {
      height: 25px;
      padding-left: 15px;
    }
    &__text {
      padding: 10px 25px 10px 15px;
      font-size: 1.1rem;
      p {
        font-weight: bold;
      }
    }
  }
  &__others {
    border-bottom: 1px;
  }
}
.m-table-list li:nth-child(2n) {
  background-color: #f8f8ff;
}
.u-fontcolor {
  color: #333333;
}
.u-header-bkgcolor {
  background-color: #ffdada;
}
.u-list-bkgcolor {
  background-color: white;
}

// transition
.fade-in {
  &-enter-active {
    transition: opacity 1s, transform 1s;
  }
  &-enter {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>
