<template>
  <button
    ref="redo"
    class="a-btn u-mouseover"
    :class="{ 'u-touch': touchFlg }"
    @click="onClickToggle"
  >
    <font-awesome-icon
      v-show="isToggleON"
      class="a-btn__icon"
      icon="toggle-on"
      size="3x"
    />
    <font-awesome-icon
      v-show="!isToggleON"
      class="a-btn__icon"
      icon="toggle-off"
      size="3x"
    />
  </button>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator"
import * as Vuex from "vuex"

@Component
export default class HeaderAreaToggle extends Vue {
  $store!: Vuex.ExStore

  // Interfaces
  @Prop()
  isToggleON!: boolean

  // Local States
  touchFlg = false
  get isVoiceUIUsed(): boolean {
    return this.$store.getters["setting/voiceUIMode"]
  }

  // Events (Watcher or Lifecycle Method)
  mounted() {
    let element = this.$refs.redo as HTMLElement
    element.addEventListener("touchstart", this.handleStartTouch)
    element.addEventListener("touchend", this.handleEndTouch)
  }
  destoryed() {
    let element = this.$refs.redo as HTMLElement
    element.removeEventListener("touchstart", this.handleStartTouch)
    element.removeEventListener("touchend", this.handleEndTouch)
  }

  // Methods
  @Emit("toggle")
  onClickToggle() {
    // This method is only for informing a parent component that the event has been triggered!!
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

<style scoped lang="scss">
.a-btn {
  width: 100%;
  height: 100%;
  position: relative;
  color: rgb(238, 177, 79);
  &__icon {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    margin: auto;

    //icon color
    &.disabled {
      color: #888888;
    }
  }
}
.u-mouseover:hover {
  background-color: #dddddd;
  &.disabled {
    background-color: transparent;
  }
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
