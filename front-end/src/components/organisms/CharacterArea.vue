<template>
  <div class="o-character-area">
    <Character class="o-character-area__character" :emotionType="emotionType" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Character from "../molecules/Character.vue"
import * as Vuex from "vuex"

@Component({
  components: {
    Character
  }
})
export default class CharacterArea extends Vue {
  $store!: Vuex.ExStore

  // Local States
  btnType = ""
  starFlg = false
  get emotionType(): number {
    return this.$store.getters["chat/emotionType"]
  }
}
</script>

<style scoped lang="scss">
.o-character-area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 14%;
  user-select: none;
  &__character {
    position: relative;
  }
}
@media screen and (max-width: 480px) {
  .o-character-area {
    height: 10%;
  }
}
@media screen and (min-width: 480px) and (max-width: 1050px) {
  .o-character-area {
    height: 12%;
  }
}
</style>
