// Data Types Regarding ChatMessage
export interface ChatMessage {
  id?: number
  speaker: string
  message: string
  goToNextFlg?: boolean
  blobData?: Blob
  selections?: Array<Selection>
  selectedCategory?: string
  transcripts?: Array<Transcript>
}
export interface Selection {
  id: string
  text: string
}

// Data Types Regarding Ajax
export interface Category {
  category: Array<Selection>
}
export interface Answer {
  answer: string
  uuid: string
  intent: string
  reference: {
    type: string
    data: string
    mime: string
  }
}

// Data Types Regarding Speech Recognition
export interface Transcript {
  id: number
  text: string
}
export interface DeviceType {
  id: number
  deviceId: string
  label: string
}

// State Regarding Display
export const enum CharacterEmotion {
  Init = 1,
  Default = 1 << 1,
  Surprised = 2,
  Happy = 1 << 3,
  Shocked = 1 << 4,
  Crestfallen = 1 << 5,
  Inspired = 1 << 6,
  Silent = 1 << 7,
  Touched = 1 << 8,
  Wondering = 1 << 9,
  Listening = 1 << 10,
  Sad = 1 << 11
}
export const enum LanguageCode {
  English = 1,
  French = 1 << 1,
  Italian = 1 << 2,
  Japanese = 1 << 3,
  Chinese = 1 << 4
}
