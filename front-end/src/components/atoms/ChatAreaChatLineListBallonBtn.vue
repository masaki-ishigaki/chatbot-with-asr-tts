<template>
  <button
    ref="list"
    class="a-list-btn u-mouseover"
    :disabled="disableFlg"
    :class="[{ disabled: disableFlg }, { 'u-touch': touchFlg }]"
    @click="onClickList(selection.id)"
  >
    <p>{{ selection.text }}</p>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator"
import { Selection } from "../../lib/types"

@Component
export default class ChatAreaChatLineListBallonBtn extends Vue {
  // Interfaces
  @Prop()
  selection!: Selection
  @Prop()
  disableFlg!: boolean

  // Local States
  touchFlg = false

  // Events (Watcher or Lifecycle Method)
  mounted() {
    let element = this.$refs.list as HTMLElement
    element.addEventListener("touchstart", this.handleStartTouch)
    element.addEventListener("touchend", this.handleEndTouch)
  }
  destoryed() {
    let element = this.$refs.list as HTMLElement
    element.removeEventListener("touchstart", this.handleStartTouch)
    element.removeEventListener("touchend", this.handleEndTouch)
  }

  // Methods
  @Emit()
  onClickList(id: string) {
    return id
  }
  handleStartTouch() {
    this.touchFlg = true
    this.$nextTick()
  }
  handleEndTouch() {
    this.touchFlg = false
    this.$nextTick()
  }
}
</script>

<style lang="scss">
.a-list-btn {
  width: 100%;
  padding: 10px 15px;
  font-size: 1rem;
  font-family: inherit;
  p {
    text-align: left;
  }
  &.disabled {
    cursor: not-allowed;
  }
}
.u-mouseover:hover {
  background-color: #dddddd;
}
@media screen and (max-width: 480px) {
  .u-mouseover:hover {
    background-color: transparent;
  }
}
.u-touch {
  background-color: #dddddd;
}
</style>
