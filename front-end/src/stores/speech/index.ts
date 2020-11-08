import { Getters, Mutations, Actions } from "vuex"
import { S, G, M, A } from "./type"
import { Transcript } from "../../lib/types"
import * as defaults from "../../lib/defaults"
import Speaker from "../../lib/functions/speaker"
import Recorder from "../../lib/functions/recorder"
import exportWAV from "../../lib/functions/exportWAV"

export const state: S = {
  recordingFlg: false,
  transcripts: [
    {
      id: 1,
      text: ""
    }
  ],
  removeLastSentence: true,
  isFirstRecog: true,
  speakingFlg: false,
  spokenTextQueue: [],
  spokenText: "",
  stateOfAnalysis: "init",
  analysisResult: 0
}

export const getters: Getters<S, G> = {
  recordingFlg(state) {
    return state.recordingFlg
  },
  transcripts(state) {
    return state.transcripts
  },
  isFirstRecog(state) {
    return state.isFirstRecog
  },
  speakingFlg(state) {
    return state.speakingFlg
  },
  stateOfAnalysis(state) {
    return state.stateOfAnalysis
  },
  analysisResult(state) {
    return state.analysisResult
  }
}

export const mutations: Mutations<S, M> = {
  setRecordingFlg(state, payload) {
    state.recordingFlg = payload
  },
  createRecorder(state) {
    state.recorder = new Recorder()
  },
  pushTranscript(state, payload) {
    state.transcripts.push(payload)
  },
  popTranscript(state) {
    state.transcripts.pop()
  },
  deleteTranscript(state) {
    state.transcripts = [
      {
        id: 1,
        text: ""
      }
    ]
  },
  setRemoveLastSentence(state, payload) {
    state.removeLastSentence = payload
  },
  setIsFirstRecog(state, payload) {
    state.isFirstRecog = payload
  },
  setSpeakingFlg(state, payload) {
    state.speakingFlg = payload
  },
  createSpeaker(state) {
    state.speaker = new Speaker()
  },
  enqueueSpokenText(state, payload) {
    state.spokenTextQueue.push(payload)
  },
  dequeueSpokenText(state) {
    if (state.spokenTextQueue.length !== 0) {
      state.spokenText = state.spokenTextQueue.shift()!
    }
  },
  deleteSpokenTextQueue(state) {
    state.spokenTextQueue = []
  },
  setStateOfAnalysis(state, payload) {
    state.stateOfAnalysis = payload
  },
  setAnalysisResult(state, payload) {
    state.analysisResult = payload
  }
}

export const actions: Actions<S, A, G, M> = {
  startRecognition(ctx) {
    ctx.commit("setRecordingFlg", true)

    // Connect to the ASR Server
    ctx.commit("createRecorder")
    let socketClient: SocketIOClient.Socket = state.recorder!.connectToAsrServer()

    // Start speech recognition
    ctx.state.recorder!.startRecording()

    // // Get the chunk of recognition result
    socketClient.on("sendRecognitionResult", function(data: any) {
      ctx.state.recorder!.recognizing = true

      let dataFinal = undefined || data.results[0].isFinal
      if (dataFinal === false) {
        if (state.removeLastSentence) {
          ctx.commit("popTranscript")
        }
        ctx.commit("setRemoveLastSentence", true)

        let transcript: Transcript = {
          id: ctx.getters.transcripts.length + 1,
          text: data.results[0].alternatives[0].transcript
        }
        ctx.commit("pushTranscript", transcript)
      } else {
        ctx.commit("popTranscript")

        let transcript: Transcript = {
          id: ctx.getters.transcripts.length + 1,
          text: data.results[0].alternatives[0].transcript
        }
        ctx.commit("pushTranscript", transcript)
        if (ctx.rootGetters["setting/voiceUIMode"]) {
          ctx.dispatch("stopRecognition")
        } else {
          ctx.commit("setRemoveLastSentence", false)
        }
      }
    })

    // Silent
    socketClient.on("stopRecognition", function(data: any) {
      if (ctx.rootGetters["setting/voiceUIMode"]) {
        ctx.dispatch("stopRecognition")
      } else {
        ctx.commit("setRemoveLastSentence", false)
      }
    })
  },
  stopRecognition(ctx) {
    ctx.commit("setRecordingFlg", false)
    ctx.state.recorder!.stopRecording()
    ctx.commit("setIsFirstRecog", true)
    ctx.commit("setRemoveLastSentence", true)
    ctx.commit("deleteTranscript")
  },
  disableIsFirstRecog(ctx) {
    ctx.commit("setIsFirstRecog", false)
  },
  startSpeaking(ctx) {
    ctx.commit("dequeueSpokenText")
    ctx.commit("setSpeakingFlg", true)
    ctx.commit("createSpeaker")
    defaults.CLIENT_DIALOGFLOW.post(
      "/speech",
      JSON.stringify({
        languageCode: 8,
        text: state.spokenText
      }),
      { responseType: "arraybuffer" }
    ).then((response) => {
      let audioSource = ctx.state.speaker!
      audioSource.setAudioData(response.data)
      audioSource.audioSource.onended = () => {
        audioSource.audioSource.stop()
        if (state.spokenTextQueue.length !== 0) {
          ctx.dispatch("startSpeaking")
        } else {
          ctx.commit("setSpeakingFlg", false)
          if (ctx.rootGetters["setting/voiceUIMode"]) {
            ctx.dispatch("startRecognition")
          }
        }
      }
      audioSource.audioSource.start(0)
    })
  },
  sayGoodbye(ctx) {
    ctx.commit("dequeueSpokenText")
    ctx.commit("setSpeakingFlg", true)
    ctx.commit("createSpeaker")
    defaults.CLIENT_DIALOGFLOW.post(
      "/speech",
      JSON.stringify({
        languageCode: 8,
        text: state.spokenText
      }),
      { responseType: "arraybuffer" }
    ).then((response) => {
      let audioSource = ctx.state.speaker!
      audioSource.setAudioData(response.data)
      audioSource.audioSource.onended = () => {
        audioSource.audioSource.stop()
        ctx.dispatch("stopSpeaking")
      }
      audioSource.audioSource.start(0)
    })
  },
  stopSpeaking(ctx) {
    ctx.commit("setSpeakingFlg", false)
    ctx.commit("deleteSpokenTextQueue")
    if (ctx.state.speaker !== undefined) {
      ctx.state.speaker.audioSource.stop()
      ctx.state.speaker.closeAudioContext()
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
