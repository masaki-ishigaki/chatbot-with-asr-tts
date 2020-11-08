<template>
  <button
    class="a-btn u-mouseover"
    :disabled="disableFlg"
    :class="{ disabled: disableFlg }"
    @click="onClick"
  >
    <font-awesome-icon
      class="a-btn__icon"
      icon="paper-plane"
      size="2x"
      :class="{ disabled: disableFlg }"
    />
  </button>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator"

@Component
export default class InputAreaSendBtn extends Vue {
  // Interfaces
  @Prop()
  disableFlg!: boolean

  // Methods
  @Emit()
  onClick() {
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
  color: rgb(0, 164, 233);
  &.disabled {
    color: #888888;
  }
  &__icon {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    margin: auto;
  }
  &.disabled {
    cursor: not-allowed;
  }
}
.u-mouseover:hover {
  background-color: #dddddd;
  &.disabled {
    background-color: transparent;
  }
}
</style>
