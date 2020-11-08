<template>
  <button
    class="a-btn u-mouseover"
    :disabled="disableFlg"
    :class="{ disabled: disableFlg, recording: recordingFlg }"
    @click="onClickStartRecognitionBtn"
  >
    <font-awesome-icon
      class="a-btn__icon"
      size="2x"
      :icon="btnIcon"
      :class="{ disabled: disableFlg }"
    />
  </button>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator"
import * as Vuex from "vuex"

@Component
export default class InputAreaMicBtn extends Vue {
  $store!: Vuex.ExStore

  // Interfaces
  @Prop()
  disableFlg!: boolean
  btnIcon = "microphone"

  // Locat States
  get recordingFlg() {
    return this.$store.getters["speech/recordingFlg"]
  }

  // Events (Watcher or Lifecycle Method)
  @Watch("recordingFlg")
  onChangeRecordingFlg() {
    if (this.recordingFlg) {
      this.btnIcon = "stop-circle"
    } else {
      this.btnIcon = "microphone"
    }
  }

  // Methods
  @Emit("recognize")
  onClickStartRecognitionBtn() {
    // This method is only for informing a parent component that the event has been triggered!!
  }
}
</script>

<style scoped lang="scss">
$gap: 20px;

.a-btn {
  width: 100%;
  height: calc(100% - #{$gap});
  position: relative;
  // icon color
  color: #3cb371;
  &.disabled {
    color: #888888;
  }
  &.recording {
    color: #ff4500;
  }
  &__icon {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    margin: auto;
  }
}
.u-mouseover:hover {
  background-color: #dddddd;
  &.disabled {
    background-color: transparent;
  }
}
</style>
