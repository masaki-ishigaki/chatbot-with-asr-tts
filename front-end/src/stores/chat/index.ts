import { Getters, Mutations, Actions } from "vuex"
import { S, G, M, A } from "./type"
import {
  ChatMessage,
  Selection,
  Category,
  Answer,
  CharacterEmotion,
  Transcript
} from "../../lib/types"
import * as defaults from "../../lib/defaults"
import * as utils from "../../lib/functions/processSpeaker"

const state: S = {
  count: 0,
  chatLogs: [],
  emotionType: CharacterEmotion.Default,
  parentCategoryID: "",
  inputDisableFlg: true,
  tempStoredEmotion: CharacterEmotion.Default,
  topic: "answer"
}

const getters: Getters<S, G> = {
  incrementedCount(state) {
    return state.count++
  },
  chatLogs(state) {
    return state.chatLogs
  },
  emotionType(state) {
    return state.emotionType
  },
  parentCategoryID(state) {
    return state.parentCategoryID
  },
  inputDisableFlg(state) {
    return state.inputDisableFlg
  },
  topic(state) {
    return state.topic
  }
}

const mutations: Mutations<S, M> = {
  pushChatLog(state, payload) {
    state.count++
    state.chatLogs.push(payload)
  },
  popChatLog(state) {
    state.chatLogs.pop()
  },
  changeChatLogs(state, payload) {
    const lastChatLogs = state.chatLogs[state.chatLogs.length - 1].transcripts
    if (lastChatLogs !== undefined) {
      state.chatLogs[state.chatLogs.length - 1].transcripts = payload.concat()
    }
  },
  setEmotionType(state, payload) {
    state.emotionType = payload
  },
  setParentCategoryID(state, payload) {
    state.parentCategoryID = payload
  },
  setInputFlg(state, payload) {
    state.inputDisableFlg = payload
  },
  switchEmotion(state, payload) {
    if (payload === "off") {
      state.tempStoredEmotion = state.emotionType
      state.emotionType = CharacterEmotion.Default
    } else {
      state.emotionType = state.tempStoredEmotion
    }
  },
  setTopic(state, payload) {
    state.topic = payload
  }
}

const actions: Actions<S, A, G, M> = {
  addChatMessage(ctx, payload) {
    if (payload.message === undefined) {
      return
    }
    let currentMsg = payload.message
    if (payload.message.startsWith("\n")) {
      currentMsg = payload.message.replace("\n", "")
    }
    let currentGoToNextFlg = false
    if (payload.goToNextFlg !== undefined) {
      currentGoToNextFlg = payload.goToNextFlg
    }
    let currentBlobData: Blob = new Blob([""], { type: "text/plain" })
    if (payload.blobData !== undefined) {
      currentBlobData = payload.blobData
    }
    let currentSelections: Array<Selection> = []
    if (payload.selections !== undefined) {
      currentSelections = payload.selections
    }
    let currentSelectedCategory = ""
    if (payload.selectedCategory !== undefined) {
      currentSelectedCategory = payload.selectedCategory
    }
    let currentTranscripts: Array<Transcript> = []
    if (payload.transcripts !== undefined) {
      currentTranscripts = payload.transcripts
    }
    const tmp: ChatMessage = {
      id: ctx.getters.incrementedCount,
      speaker: payload.speaker,
      message: currentMsg,
      goToNextFlg: currentGoToNextFlg,
      blobData: currentBlobData,
      selections: currentSelections,
      selectedCategory: currentSelectedCategory,
      transcripts: currentTranscripts
    }
    ctx.commit("pushChatLog", tmp)
  },
  deleteFinalChat(ctx) {
    ctx.commit("popChatLog")
  },
  createDefaultMessage(ctx, payload) {
    const reaction = utils.getDefaultMessage(payload)

    if (payload === "others-is-selected") {
      ctx.commit("setEmotionType", CharacterEmotion.Listening)
      ctx.commit("setInputFlg", false)
    }
    if (payload === "failed-to-guide") {
      ctx.commit("setEmotionType", CharacterEmotion.Sad)
      ctx.commit("setInputFlg", false)
    }
    let goToNextFlg = false
    if (payload === "is-chat-finished") {
      goToNextFlg = true
    }

    const tmp: ChatMessage = {
      speaker: reaction[0],
      message: reaction[1],
      goToNextFlg: goToNextFlg
    }
    ctx.dispatch("addChatMessage", tmp)
  },
  createErrorMessage(ctx) {
    const reaction = utils.getDefaultMessage("error")

    const tmp: ChatMessage = {
      speaker: reaction[0],
      message: reaction[1],
      goToNextFlg: false
    }
    ctx.dispatch("addChatMessage", tmp)
  },
  makeInputAreaDisable(ctx, payload) {
    ctx.commit("setInputFlg", payload)
  },
  displayQuestionSelect(ctx, payload) {
    const msgAndTiming = utils.getIgnitionMessage(payload)

    ctx.dispatch("addChatMessage", { speaker: "bot-thinking", message: "" })

    let tmp: ChatMessage
    function displaySelections(acquiredSelections: Array<Selection>) {
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          tmp = {
            speaker: "bot-main-category",
            message: "",
            selections: acquiredSelections
          }
          ctx.dispatch("addChatMessage", tmp)
          ctx.commit("setEmotionType", CharacterEmotion.Wondering)
          ctx.commit("setTopic", "main-category")
          resolve("Finish Displaying Selections!")
        }, 1000)
      })
    }
    async function getCategorySequence() {
      try {
        const response = await defaults.CLIENT_DIALOGFLOW.post<Category>(
          "/main-category",
          JSON.stringify({
            languageCode: 8
          })
        )
        ctx.dispatch("deleteFinalChat")
        tmp = { speaker: "bot-ask-to-select", message: msgAndTiming[0] }
        ctx.dispatch("addChatMessage", tmp)
        await displaySelections(response.data.category)
      } catch (err) {
        ctx.dispatch("deleteFinalChat")
        console.log(err)
        ctx.dispatch("createErrorMessage")
      }
    }

    getCategorySequence()
  },
  selectMainCategory(ctx, payload) {
    ctx.dispatch("makeInputAreaDisable", true)
    defaults.CLIENT_DIALOGFLOW.post(
      "/sub-category",
      JSON.stringify({
        main_id: payload.categoryType[0],
        languageCode: 8
      })
    )
      .then((response) => {
        ctx.commit("setEmotionType", CharacterEmotion.Wondering)
        const selections = response.data.category
        console.log(payload.categoryType[0])
        ctx.commit("setParentCategoryID", payload.categoryType[0])

        let tmp: ChatMessage
        if (payload.needUserBallon) {
          tmp = {
            speaker: "user",
            message: payload.categoryType[1]
          }
          ctx.dispatch("addChatMessage", tmp)
        }
        tmp = {
          speaker: "bot-sub-category",
          message: "",
          selections: selections,
          selectedCategory: payload.categoryType[1]
        }
        setTimeout(() => {
          ctx.dispatch("addChatMessage", tmp)
          ctx.commit("setTopic", "sub-category")
        }, 1000)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  selectSubCategory(ctx, payload) {
    ctx.dispatch("makeInputAreaDisable", true)
    defaults.CLIENT_DIALOGFLOW.post(
      "/questions",
      JSON.stringify({
        main_id: payload.categoryType[0],
        sub_id: payload.categoryType[1],
        languageCode: 8
      })
    )
      .then((response) => {
        ctx.commit("setEmotionType", CharacterEmotion.Wondering)
        const selections = response.data.category
        ctx.commit("setParentCategoryID", payload.categoryType[1])

        let tmp: ChatMessage
        if (payload.needUserBallon) {
          tmp = {
            speaker: "user",
            message: payload.categoryType[2]
          }
          ctx.dispatch("addChatMessage", tmp)
        }
        tmp = {
          speaker: "bot-faq",
          message: "",
          selections: selections,
          selectedCategory: payload.categoryType[2]
        }
        setTimeout(() => {
          ctx.dispatch("addChatMessage", tmp)
          ctx.commit("setTopic", "faq")
        }, 1000)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  submit(ctx, payload) {
    ctx.commit("setInputFlg", true)
    const tmp: ChatMessage = { speaker: "user", message: payload }
    ctx.dispatch("addChatMessage", tmp)
    ctx.dispatch("askToDialogflow", payload)
  },
  updateTranscripts(ctx, payload) {
    ctx.commit("changeChatLogs", payload)
  },
  askToDialogflow(ctx, payload) {
    function displayThinkingBaloon() {
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          ctx.dispatch("addChatMessage", {
            speaker: "bot-thinking",
            message: ""
          })
          resolve("Finish Displaying Thinking Ballon")
        }, 1000)
      })
    }

    function displayLink(url: string) {
      const tmp: ChatMessage = { speaker: "bot-link", message: url }
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          ctx.dispatch("addChatMessage", tmp)
          resolve("Finish Displaying Link")
        }, 1000)
      })
    }

    function goToNextQuestion() {
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          ctx.dispatch("createDefaultMessage", "is-chat-finished")
          ctx.commit("setTopic", "finish-chat")
          resolve("Finish Displaying Question Select Ballon!")
        }, 1000)
      })
    }

    async function querySequence(queryMessage: string) {
      ctx.commit("setEmotionType", CharacterEmotion.Default)

      // Display Thinking Ballon
      await displayThinkingBaloon()

      // Send query to Dialogflow
      try {
        const responseMsg = await defaults.CLIENT_DIALOGFLOW.post<Answer>(
          "/query",
          JSON.stringify({
            query: queryMessage,
            languageCode: 8
          })
        )
        const answer = responseMsg.data.answer
        const reference = responseMsg.data.reference

        // Delete Thinking Ballon
        ctx.dispatch("deleteFinalChat")

        // Dispaly the answer from Dialogflow
        let tmp: ChatMessage = { speaker: "bot-answer", message: answer }
        ctx.dispatch("addChatMessage", tmp)

        if (reference.type === "link") {
          await displayLink(reference.data)
        }
        if (reference.type === "image" || reference.type === "video") {
          await displayThinkingBaloon()
          try {
            const responseRef = await defaults.CLIENT_DIALOGFLOW.post(
              "/reference",
              JSON.stringify({
                location: reference.data,
                mime: reference.mime
              }),
              { responseType: "arraybuffer" }
            )
            ctx.dispatch("deleteFinalChat")

            const blob = new Blob([responseRef.data], { type: reference.mime })
            let displayTarget: string
            if (reference.type === "image") {
              displayTarget = "bot-image"
            } else {
              displayTarget = "bot-video"
            }
            tmp = { speaker: displayTarget, message: "", blobData: blob }
            ctx.dispatch("addChatMessage", tmp)
          } catch (err) {
            ctx.dispatch("deleteFinalChat")
            console.log(err)
            ctx.dispatch("createErrorMessage")
            return
          }
        }

        await goToNextQuestion()
      } catch (err) {
        ctx.dispatch("deleteFinalChat")
        console.log(err)
        ctx.dispatch("createErrorMessage")
      }
    }
    querySequence(payload)
  },
  changeEmotion(ctx, payload) {
    if (typeof payload === "number") {
      ctx.commit("setEmotionType", payload)
    }
  },
  evacuateCurrentEmotion(ctx, payload) {
    ctx.commit("switchEmotion", payload)
  },
  connectToIVR(ctx) {
    defaults.CLIENT_DIALOGFLOW.get("/phone-call")
      .then((response) => {
        let tmp: ChatMessage
        tmp = {
          speaker: "bot-phone",
          message: response.data.utterance
        }
        setTimeout(() => {
          ctx.dispatch("addChatMessage", tmp)
          ctx.commit("setTopic", "phone")
        }, 1000)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
