export default class Speaker {
  private audioContext: AudioContext
  public audioSource: AudioBufferSourceNode

  constructor() {
    this.audioContext = new AudioContext()
    this.audioSource = this.audioContext.createBufferSource()
  }

  setAudioData(audioData: ArrayBuffer) {
    this.audioContext.decodeAudioData(audioData).then((buff) => {
      this.audioSource.buffer = buff
    })
    this.audioSource.connect(this.audioContext.destination)
  }

  closeAudioContext() {
    this.audioContext.close()
  }
}
