import Vue, { VNode } from "vue"

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

// declare global {
//   interface Window {
//     webkitAudioContext: AudioContext
//   }
// }
declare global {
  interface Window {
    AudioContext: typeof AudioContext
    webkitAudioContext: typeof AudioContext
  }
}
