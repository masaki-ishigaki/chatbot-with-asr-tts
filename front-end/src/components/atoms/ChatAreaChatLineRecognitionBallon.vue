<template>
  <transition appear name="fade-in">
    <div>
      <div class="a-reocg-ballon">
        <p
          v-for="transcript in transcripts"
          class="a-recog-ballon__text u-fontcolor"
          :key="transcript.id"
        >
          {{ transcript.text }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class ChatAreaChatLineRecognitionBallon extends Vue {
  // Interfaces
  @Prop()
  transcripts!: string
}
</script>

<style scoped lang="scss">
.a-recog-ballon {
  &::before {
    content: "xxxx";
    display: block;
    width: 100%;
    height: 7px;
  }
  max-width: 80%;
  &__text {
    padding: 0 15px;
    white-space: pre-wrap;
  }
}
.u-fontcolor {
  color: white;
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
