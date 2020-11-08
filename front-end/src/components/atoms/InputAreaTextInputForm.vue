<template>
  <input
    class="a-input"
    v-model="message"
    @keydown.enter="inputText"
    :disabled="disableFlg"
    type="text"
    :placeholder="placeholderMsg"
  />
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator"
import Messages from "../../lib/messages"
import * as Vuex from "vuex"

@Component
export default class InputAreaTextInputForm extends Vue {
  $store!: Vuex.ExStore

  // Interfaces
  @Prop()
  disableFlg!: boolean

  // Local States
  message = ""
  placeholderMsg = "質問文を入力"

  // Events (Watcher or Lifecycle Method)
  @Watch("disableFlg")
  focusTextInput(newValue: boolean, oldValue: boolean) {
    if (newValue === false) {
      this.$nextTick(() => {
        let targetElement = this.$el as HTMLElement
        targetElement.focus()
      })
    }
  }

  // Methods
  @Emit()
  inputText() {
    // This method is only for informing a parent component that the event has been triggered!!
  }
}
</script>

<style scoped lang="scss">
$gap: 20px;

.a-input {
  height: calc(100% - #{$gap});
  width: 100%;
  border-radius: 5px;
  box-shadow: 2px 2px rgb(202, 202, 202) inset;
  border: none;
  outline: 0;
  font-size: 18px;
  padding: 0px 15px;
  &::placeholder {
    color: rgb(200, 200, 200);
    font-weight: bold;
  }
}

input[type="text"][disabled] {
  background: #dcdcdc;
}
</style>
