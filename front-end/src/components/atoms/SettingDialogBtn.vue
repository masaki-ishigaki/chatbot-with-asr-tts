<template>
  <b-button
    class="o-dialogbox__btn"
    :disable="disableFlg"
    :type="colorType"
    @click="onClickBtn"
  >
    {{ label }}
  </b-button>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator"

@Component
export default class SettingDialogBtn extends Vue {
  // Interfaces
  @Prop()
  disableFlg!: boolean
  @Prop()
  colorType!: string
  @Prop()
  label!: string

  // Methods
  @Emit()
  onClickBtn() {
    // emit
  }
}
</script>
