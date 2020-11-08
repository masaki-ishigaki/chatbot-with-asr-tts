<template>
  <div>
    <b-field>
      <b-select v-model="selectedLanguageCode" icon="language">
        <option class="u-nochoice" disabled value="">
          Please Select Language
        </option>
        <option v-for="option in options" :value="option.code" :key="option.id">
          {{ option.text }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Emit, Vue } from "vue-property-decorator"
import { LanguageCode } from "../../lib/types"

@Component
export default class SettingDialogSelectBox extends Vue {
  // Local States
  selectedLanguageCode = 0
  options = [
    { id: 1, code: LanguageCode.English, text: "English" },
    { id: 2, code: LanguageCode.French, text: "Français" },
    { id: 3, code: LanguageCode.Italian, text: "Italiano" },
    { id: 4, code: LanguageCode.Japanese, text: "日本語" },
    { id: 5, code: LanguageCode.Chinese, text: "中文" }
  ]

  // event
  @Watch("selectedLanguageCode")
  onSelectLanguage(newValue: number) {
    this.selectLanguage(newValue)
  }

  // Methods
  @Emit("select")
  selectLanguage(languageCode: number) {
    return languageCode
  }
}
</script>

<style lang="scss">
.u-nochoice {
  font-weight: bold;
}
</style>
