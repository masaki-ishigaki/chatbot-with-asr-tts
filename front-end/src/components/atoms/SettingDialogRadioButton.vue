<template>
  <section>
    <b-field>
      <b-radio-button
        v-model="radioButton"
        native-value="Auto"
        type="is-success"
        :disabled="disableFlg"
      >
        <span>Auto</span>
      </b-radio-button>

      <b-radio-button
        v-model="radioButton"
        native-value="Manual"
        type="is-info"
        :disabled="disableFlg"
      >
        <span>Manual</span>
      </b-radio-button>
    </b-field>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator"

@Component
export default class SettingDialogRadioButton extends Vue {
  // Interfaces
  @Prop()
  disableFlg!: boolean

  // Local States
  radioButton = "Auto"

  // event
  @Watch("radioButton")
  onRadioButtonClicked(newValue: string) {
    this.clickRadio(newValue)
  }

  // Methods
  @Emit("radio")
  clickRadio(btnKind: string) {
    return btnKind
  }
}
</script>
