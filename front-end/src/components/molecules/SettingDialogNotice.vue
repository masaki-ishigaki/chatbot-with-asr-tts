<template>
  <div class="m-notice">
    <div class="m-notice__text" :class="colorClass">
      <p>{{ message }}</p>
    </div>
    <SettingDialogListening v-show="state === 'listening'" />
    <SettingDialogAnalyzing v-show="state === 'analyzing'" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator"
import SettingDialogListening from "../atoms/SettingDialogListening.vue"
import SettingDialogAnalyzing from "../atoms/SettingDialogAnalyzing.vue"

@Component({
  components: {
    SettingDialogListening,
    SettingDialogAnalyzing
  }
})
export default class SettingDialogNotice extends Vue {
  // Interfaces
  @Prop()
  state!: string
  @Prop()
  message!: string

  // LocalStates
  colorClass = "u-listening-color"

  @Watch("state")
  onStateChanged(newValue: string) {
    if (newValue === "listening") {
      this.colorClass = "u-listening-color"
    } else if (newValue === "analyzing") {
      this.colorClass = "u-analyzing-color"
    } else {
      this.colorClass = "u-failed-color"
    }
  }
}
</script>

<style scoped lang="scss">
.m-notice {
  display: flex;
  &__text {
    width: 50%;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 1.2rem;
    padding: 0 20px;
  }
}
.u-listening-color {
  color: #32cd32;
}
.u-analyzing-color {
  color: #ffd700;
}
.u-failed-color {
  color: #333333;
}
</style>
