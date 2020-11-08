// Write string into DataView
function writeString(view: DataView, offset: number, input: string): void {
  for (let i = 0; i < input.length; i++) {
    view.setUint8(offset + i, input.charCodeAt(i))
  }
}

// PCM
function floatTo16BitPCM(view: DataView, offset: number, input: any): void {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s: number = Math.max(-1, Math.min(1, input[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
}

function encodeWAV(samples: any, sampleRate: number): DataView {
  const buffer: ArrayBuffer = new ArrayBuffer(44 + samples.length * 2)
  const view: DataView = new DataView(buffer)

  writeString(view, 0, "RIFF") // RIFF chank name
  view.setUint32(4, 32 + samples.length * 2, true) // RIFF chank size
  writeString(view, 8, "WAVE") // Wave header
  writeString(view, 12, "fmt ") // fmt chunk name
  view.setUint32(16, 16, true) // fmt chunk size
  view.setUint16(20, 1, true) // Format ID(PCM)
  view.setUint16(22, 1, true) // Channel number
  view.setUint32(24, sampleRate, true) // Sampling frequency
  view.setUint32(28, sampleRate * 2, true) // Byte size per second
  view.setUint16(32, 2, true) // Size per block
  view.setUint16(34, 16, true) // Bit number per sampling
  writeString(view, 36, "data") // Data chunk name
  view.setUint32(40, samples.length * 2, true) // Voice data size
  floatTo16BitPCM(view, 44, samples) // Voice data

  return view
}

// Merge array data
function mergeBuffers(audioData: Array<Float32Array>): Float32Array {
  let sampleLength = 0
  let sampleIdx = 0
  let i, j: number

  for (i = 0; i < audioData.length; i++) {
    sampleLength += audioData[i].length
  }

  const samples = new Float32Array(sampleLength)
  for (i = 0; i < audioData.length; i++) {
    for (j = 0; j < audioData[i].length; j++) {
      samples[sampleIdx] = audioData[i][j]
      sampleIdx++
    }
  }

  return samples
}

export default function(
  audioData: Array<Float32Array>,
  sampleRate: number
): Blob {
  // Encode extracted audio data into wave format -> Make Blob
  const dataView = encodeWAV(mergeBuffers(audioData), sampleRate)
  const audioBlob = new Blob([dataView], { type: "audio/wav" })

  return audioBlob
}
