<template>
  <transition appear name="fade-in">
    <div>
      <a :href="videoSource" target="_blank">
        <video
          class="a-video-ballon"
          autoplay
          muted
          :src="videoSource"
          @load="finishLoadingVideo"
        ></video>
      </a>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import * as Vuex from "vuex"

@Component
export default class ChatAreaChatLineVideoBallon extends Vue {
  $store!: Vuex.ExStore

  // Interfaces
  @Prop()
  blob!: Blob

  // Local States
  videoSource = ""

  // Events (Watcher or Lifecycle Method)
  created() {
    this.videoSource = URL.createObjectURL(this.blob)
  }

  // Methods
  finishLoadingVideo() {
    this.$store.dispatch("setting/changeLoadingState", true)
  }
}
</script>

<style scoped lang="scss">
.a-video-ballon {
  max-width: 80%;
  border-radius: 0px 15px 15px 15px;
  box-shadow: 2px 2px #eeeeee;
}

// transition
.fade-in {
  &-enter-active {
    transition: opacity 1s, transform 1s;
  }
  &-enter {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>
