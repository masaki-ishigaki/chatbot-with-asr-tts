<template>
  <transition appear name="fade-in">
    <p class="a-link-ballon u-fontcolor">
      <a :href="url" target="_blank">{{ url }}</a>
    </p>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class ChatAreaChatLineLinkBallon extends Vue {
  // Interfaces
  @Prop()
  url!: string

  // Local States
  imageSource = ""
}
</script>

<style scoped lang="scss">
.a-link-ballon {
  padding: 7px 15px;
  max-width: 80%;
  white-space: pre-wrap;
}
.u-fontcolor {
  color: #080ccf;
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
