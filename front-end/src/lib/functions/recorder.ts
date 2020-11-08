import io from "socket.io-client"
import { ASR_SERVER_URL } from "../../lib/defaults"

export default class Recorder {
  private bufferSize = 2048
  private numberOfInputChannels = 1
  private numberOfOutputChannels = 1
  private audioContext: AudioContext
  private silentCount: number
  private socket?: SocketIOClient.Socket
  public audioData: Array<Float32Array>
  public recognizing: boolean

  constructor() {
    if (!navigator.mediaDevices) {
      alert("お使いのブラウザでは、音声認識は使用できません。")
    }
    this.audioContext = new AudioContext()
    this.silentCount = 0
    this.audioData = []
    this.recognizing = false
  }

  connectToAsrServer() {
    this.socket = io(ASR_SERVER_URL)

    return this.socket
  }

  callbackStream(stream: MediaStream) {
    const streamSource = this.audioContext.createMediaStreamSource(stream)
    const scriptProcessor = this.audioContext.createScriptProcessor(
      this.bufferSize,
      this.numberOfInputChannels,
      this.numberOfOutputChannels
    )
    const analyzer = this.audioContext.createAnalyser()
    const frequencies = new Uint8Array(analyzer.frequencyBinCount)

    streamSource.connect(analyzer)
    streamSource.connect(scriptProcessor)
    scriptProcessor.connect(this.audioContext.destination)

    // TODO: ScriptProcessorNode is deprecated!!
    scriptProcessor.onaudioprocess = (event) => {
      analyzer.getByteFrequencyData(frequencies)
      const sumOfFrequencies = frequencies.reduce((previous, current) => {
        return previous + current
      })
      const averageOfFrequencies = sumOfFrequencies / analyzer.frequencyBinCount
      if (this.recognizing && averageOfFrequencies < 10) {
        this.silentCount++
        console.log(this.silentCount)
      }
      if (this.silentCount > 50) {
        if (this.socket !== undefined) {
          this.socket.emit("silentIsDetected")
        }
      }

      if (this.socket !== undefined) {
        const left = event.inputBuffer.getChannelData(0)
        const left16 = this.downsampleBuffer(left, 44100, 16000)
        this.socket.emit("sendAudioData", left16)
      } else {
        const bufferData = new Float32Array(this.bufferSize)
        for (let i = 0; i < this.bufferSize; i++) {
          bufferData[i] = event.inputBuffer.getChannelData(0)[i]
        }
        this.audioData.push(bufferData)
      }
    }
  }

  startRecording() {
    if (this.socket !== undefined) {
      this.socket.emit("startStreamingRecognition", "")
    }

    const constraints = {
      audio: true,
      video: false
    }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this.callbackStream.bind(this))
      .catch((error) => {
        console.log(error)
        alert("MediaDeviceへの接続ができないため、音声認識は使用できません。")
      })
  }

  stopRecording() {
    // Stop sending audio data to the server
    if (this.socket !== undefined) {
      this.socket.emit("stopStreamingRecognition", "")
      this.audioContext.close()
      this.socket.disconnect()
    }
  }

  downsampleBuffer(
    buffer: Float32Array,
    sampleRate: number,
    outSampleRate: number
  ) {
    if (outSampleRate === sampleRate) {
      return buffer
    }

    if (outSampleRate > sampleRate) {
      throw new Error(
        "downsampling rate show be smaller than original sample rate"
      )
    }

    const sampleRateRatio = sampleRate / outSampleRate
    const newLength = Math.round(buffer.length / sampleRateRatio)
    const result = new Int16Array(newLength)
    let offsetResult = 0
    let offsetBuffer = 0
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio)
      let accum = 0
      let count = 0
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i]
        count++
      }

      result[offsetResult] = Math.min(1, accum / count) * 0x7fff
      offsetResult++
      offsetBuffer = nextOffsetBuffer
    }
    return result.buffer
  }
}
