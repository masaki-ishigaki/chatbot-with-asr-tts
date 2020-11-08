<template>
  <transition>
    <div
      v-if="displayLanguageCode === englishCode"
      key="a"
      class="a-flash-text"
    >
      <p v-html="htmlTitle[0]"></p>
    </div>
    <div
      v-else-if="displayLanguageCode === frenchCode"
      key="b"
      class="a-flash-text"
    >
      <p v-html="htmlTitle[1]"></p>
    </div>
    <div
      v-else-if="displayLanguageCode === italianCode"
      key="c"
      class="a-flash-text"
    >
      <p v-html="htmlTitle[2]"></p>
    </div>
    <div
      v-else-if="displayLanguageCode === japaneseCode"
      key="d"
      class="a-flash-text"
    >
      <p v-html="htmlTitle[3]"></p>
    </div>
    <div v-else key="e" class="a-flash-text">
      <p v-html="htmlTitle[4]"></p>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator"
import { LanguageCode } from "../../lib/types"

@Component
export default class SettingDialogFlashText extends Vue {
  // Interfaces
  @Prop()
  htmlTitle!: Array<string>
  @Prop()
  clearTimerFlg!: boolean

  // Local States
  intervalID = 0
  displayLanguageCode: number = LanguageCode.English
  englishCode = LanguageCode.English
  frenchCode = LanguageCode.French
  italianCode = LanguageCode.Italian
  japaneseCode = LanguageCode.Japanese
  chineseCode = LanguageCode.Chinese

  // Lifecycle Hook
  @Watch("clearTimerFlg")
  clearTimer(newValue: boolean, oldValue: boolean) {
    if (newValue === true) {
      clearInterval(this.intervalID)
    }
  }
  mounted() {
    this.intervalID = setInterval(() => {
      if (this.displayLanguageCode < 10) {
        this.displayLanguageCode = this.displayLanguageCode << 1
      } else {
        this.displayLanguageCode = LanguageCode.English
      }
    }, 3000)
  }
}
</script>

<style scoped lang="scss">
.a-flash-text {
  font-size: 1.2rem;
}

// Transition Setting
.v-enter-active,
.v-leave-active {
  transition: opacity 1s;
}
.v-leave-active {
  position: absolute;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
