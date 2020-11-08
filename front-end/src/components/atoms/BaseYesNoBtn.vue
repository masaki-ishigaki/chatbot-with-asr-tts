<template>
  <button class="a-btn-yesno" :class="btnType" @click="onClickYesNo()">
    <div class="a-btn-yesno__image" v-if="btnType === 'yes'">
      <p class="a-btn-yesno__image__label">{{ yesText }}</p>
    </div>
    <div class="a-btn-yesno__image" v-else-if="btnType === 'no'">
      <p class="a-btn-yesno__image__label">{{ noText }}</p>
    </div>
    <div v-else></div>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator"
import Messages from "../../lib/messages"

@Component
export default class YesNoBtn extends Vue {
  // Interfaces
  @Prop()
  btnType!: string

  // Local States
  yesText = "はい"
  noText = "いいえ"
  get languageCode() {
    return this.$store.getters["setting/languageCode"]
  }

  // Events (Watcher or Lifecycle Method)
  created() {
    let defaultMessages = new Messages(this.languageCode)
    this.yesText = defaultMessages.YES
    this.noText = defaultMessages.NO
  }

  // Methods
  @Emit()
  onClickYesNo() {
    // This method is only for informing a parent component that the event has been triggered!!
  }
}
</script>

<style scoped lang="scss">
.a-btn-yesno {
  &:active {
    -webkit-transform: translateY(4px);
    transform: translateY(4px);
    border-bottom: none;
  }
  &__image {
    &::before {
      content: "";
      display: block;
      height: 20%;
    }
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    &__label {
      font-weight: bold;
      font-size: 0.9rem;
      color: rgb(165, 156, 156);
    }
  }
}
@media screen and (max-width: 480px) {
  .a-btn-yesno {
    &__image {
      &::before {
        height: 32%;
      }
      &__label {
        font-weight: bold;
        color: white;
      }
    }
  }
}

.yes {
  background-color: rgba(255, 231, 231, 1);
  border-bottom: solid 4px rgba(255, 179, 179, 1);
}
.no {
  background-color: #cbe3ee;
  border-bottom: solid 4px #9cc6da;
}
</style>
