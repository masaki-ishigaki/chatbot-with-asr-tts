<template>
  <div ref="dog" class="m-character">
    <!--Welcome-->
    <img
      v-show="(dispFlg & stateInit) !== 0"
      class="m-character__image1 bound"
      src="../../assets/images/questioner.png"
      alt="Welcome Character Image"
    />
    <!--Default-->
    <img
      v-show="(dispFlg & stateDefault) !== 0"
      class="m-character__image1"
      src="../../assets/images/questioner.png"
      alt="Default Character Image"
    />
    <!--Shocked-->
    <img
      v-show="(dispFlg & stateShocked) !== 0"
      class="m-character__image1"
      src="../../assets/images/character_shocked.png"
      alt="Shocked Character Image"
    />
    <!--Touched-->
    <img
      v-show="(dispFlg & stateTouched) !== 0"
      class="m-character__image1"
      src="../../assets/images/character_touched.png"
      alt="Touched Character Image"
    />
    <!--Wondering-->
    <img
      v-show="(dispFlg & stateWondering) !== 0"
      class="m-character__image1"
      src="../../assets/images/character_wondering.png"
      alt="Wondering Character Image"
    />
    <!--Listening-->
    <img
      v-show="(dispFlg & stateListening) !== 0"
      class="m-character__image1"
      src="../../assets/images/character_listening.png"
      alt="Listening Character Image"
    />
    <!--Sad-->
    <img
      v-show="(dispFlg & stateSad) !== 0"
      class="m-character__image1"
      src="../../assets/images/character_sad.png"
      alt="Sad Character Image"
    />
    <TouchedEmotion :emotionType="emotionType" />
    <ShockedEmotion :emotionType="emotionType" />
    <WonderingEmotion :emotionType="emotionType" />
    <ListeningEmotion :emotionType="emotionType" />
    <SadEmotion :emotionType="emotionType" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator"
import { CharacterEmotion } from "../../lib/types"
import TouchedEmotion from "../animation/TouchedEmotion.vue"
import ShockedEmotion from "../animation/ShockedEmotion.vue"
import WonderingEmotion from "../animation/WonderingEmotion.vue"
import ListeningEmotion from "../animation/ListeningEmotion.vue"
import SadEmotion from "../animation/SadEmotion.vue"

@Component({
  components: {
    TouchedEmotion,
    ShockedEmotion,
    WonderingEmotion,
    ListeningEmotion,
    SadEmotion
  }
})
export default class Character extends Vue {
  // Interfaces
  @Prop()
  emotionType!: number

  // Local States
  dispFlg: number = CharacterEmotion.Default
  stateInit: number = CharacterEmotion.Init
  stateDefault: number = CharacterEmotion.Default
  stateSurprised: number = CharacterEmotion.Surprised
  stateHappy: number = CharacterEmotion.Happy
  stateShocked: number = CharacterEmotion.Shocked
  stateCrestfallen: number = CharacterEmotion.Crestfallen
  stateInspired: number = CharacterEmotion.Inspired
  stateSilent: number = CharacterEmotion.Silent
  stateTouched: number = CharacterEmotion.Touched
  stateWondering: number = CharacterEmotion.Wondering
  stateListening: number = CharacterEmotion.Listening
  stateSad: number = CharacterEmotion.Sad

  // Events (Watcher or Lifecycle Method)
  @Watch("emotionType")
  onDisplayEmotion(newItem: number, oldItem: number) {
    this.dispFlg = newItem
  }
  created() {
    window.addEventListener("resize", this.handleResize, false)
  }
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize, false)
  }

  // Methods
  handleResize() {
    const dogElement = this.$refs.dog as HTMLElement
    let j = 0
    for (let i = 0; i < 5; i++) {
      let tmpElement = dogElement.children[i] as HTMLElement
      if (tmpElement.style.display !== "none") {
        break
      }
      j++
    }
    let faceElement = dogElement.children[j] as HTMLElement
    let faceHeight = faceElement.offsetHeight
    faceElement.style.width = faceHeight + "px"
    dogElement.style.width = faceHeight + "px"
  }
}
</script>

<style scoped lang="scss">
.m-character {
  height: 100%;
  // Dog Face
  &__image1 {
    height: 100%;
    box-shadow: 2px 2px #eeeeee;
    border-radius: 50%;
    z-index: 0;
  }
}
// transition
.bound {
  animation: bounce_8285 2.5s ease;
}
@keyframes bounce_8285 {
  0% {
    transform: translateY(0);
  }
  5.55556% {
    transform: translateY(0);
  }
  11.11111% {
    transform: translateY(0);
  }
  22.22222% {
    transform: translateY(-30px);
  }
  27.77778% {
    transform: translateY(0);
  }
  33.33333% {
    transform: translateY(-30px);
  }
  44.44444% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes stay {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
