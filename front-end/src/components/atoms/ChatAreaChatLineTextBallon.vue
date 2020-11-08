<template>
  <transition appear name="fade-in">
    <p class="a-text-ballon u-fontcolor">{{ message }}</p>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class ChatAreaChatLineTextBallon extends Vue {
  // Interfaces
  @Prop()
  message!: string
}
</script>

<style scoped lang="scss">
.a-text-ballon {
  padding: 7px 15px;
  max-width: 80%;
  white-space: pre-wrap;
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

.u-fontcolor {
  color: #333333;
}
</style>
