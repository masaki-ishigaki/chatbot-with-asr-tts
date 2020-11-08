import { Transcript } from "../../lib/types"
import Recorder from "../../lib/functions/recorder"
import Speaker from "../../lib/functions/speaker"

export interface S {
  recordingFlg: boolean
  recorder?: Recorder
  speaker?: Speaker
  transcripts: Array<Transcript>
  removeLastSentence: boolean
  isFirstRecog: boolean
  speakingFlg: boolean
  spokenTextQueue: Array<string>
  spokenText: string
  stateOfAnalysis: string
  analysisResult: number
}

export interface G {
  recordingFlg: boolean
  transcripts: Array<Transcript>
  isFirstRecog: boolean
  speakingFlg: boolean
  stateOfAnalysis: string
  analysisResult: number
}

export interface RG {
  "speech/recordingFlg": G["recordingFlg"]
  "speech/transcripts": G["transcripts"]
  "speech/isFirstRecog": G["isFirstRecog"]
  "speech/speakingFlg": G["speakingFlg"]
  "speech/stateOfAnalysis": G["stateOfAnalysis"]
  "speech/analysisResult": G["analysisResult"]
}

export interface M {
  setRecordingFlg: boolean
  createRecorder: Recorder
  pushTranscript: Transcript
  popTranscript: void
  deleteTranscript: void
  setRemoveLastSentence: boolean
  setIsFirstRecog: boolean
  setSpeakingFlg: boolean
  createSpeaker: Speaker
  enqueueSpokenText: string
  dequeueSpokenText: void
  deleteSpokenTextQueue: void
  setStateOfAnalysis: string
  setAnalysisResult: number
}

export interface RM {
  "speech/setRecordingFlg": M["setRecordingFlg"]
  "speech/createRecorder": M["createRecorder"]
  "speech/pushTranscript": M["pushTranscript"]
  "speech/popTranscript": M["popTranscript"]
  "speech/deleteTranscript": M["deleteTranscript"]
  "speech/setRemoveLastSentence": M["setRemoveLastSentence"]
  "speech/setIsFirstRecog": M["setIsFirstRecog"]
  "speech/setSpeakingFlg": M["setSpeakingFlg"]
  "speech/createSpeaker": M["createSpeaker"]
  "speech/enqueueSpokenText": M["enqueueSpokenText"]
  "speech/dequeueSpokenText": M["dequeueSpokenText"]
  "speech/deleteSpokenTextQueue": M["deleteSpokenTextQueue"]
  "speech/setStateOfAnalysis": M["setStateOfAnalysis"]
  "speech/setAnalysisResult": M["setAnalysisResult"]
}

export interface A {
  startRecognition: void
  stopRecognition: void
  disableIsFirstRecog: void
  startSpeaking: void
  sayGoodbye: void
  stopSpeaking: void
}

export interface RA {
  "speech/startRecognition": A["startRecognition"]
  "speech/stopRecognition": A["stopRecognition"]
  "speech/disableIsFirstRecog": A["disableIsFirstRecog"]
  "speech/startSpeaking": A["startSpeaking"]
  "speech/sayGoodbye": A["sayGoodbye"]
  "speech/stopSpeaking": A["stopSpeaking"]
}
