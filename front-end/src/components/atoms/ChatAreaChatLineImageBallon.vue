<template>
  <transition appear name="fade-in">
    <div>
      <a :href="imageSource" target="_blank">
        <img
          class="a-image-ballon"
          :src="imageSource"
          @load="finishLoadingImage"
        />
      </a>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import * as Vuex from "vuex"

@Component
export default class ChatAreaChatLineImageBallon extends Vue {
  $store!: Vuex.ExStore

  // Interfaces
  @Prop()
  blob!: Blob

  // Local States
  imageSource = ""

  // Events (Watcher or Lifecycle Method)
  created() {
    this.imageSource = URL.createObjectURL(this.blob)
  }

  // Methods
  finishLoadingImage() {
    this.$store.dispatch("setting/changeLoadingState", true)
  }
}
</script>

<style scoped lang="scss">
.a-image-ballon {
  width: 50%;
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
