import { ChatMessage, Transcript } from "../../lib/types"

export interface S {
  count: number
  chatLogs: Array<ChatMessage>
  inputDisableFlg: boolean
  parentCategoryID: string
  emotionType: number
  tempStoredEmotion: number
  topic: string
}

export interface G {
  incrementedCount: number
  chatLogs: Array<ChatMessage>
  inputDisableFlg: boolean
  parentCategoryID: string
  emotionType: number
  topic: string
}
export interface RG {
  "chat/incrementedCount": G["incrementedCount"]
  "chat/chatLogs": G["chatLogs"]
  "chat/parentCategoryID": G["parentCategoryID"]
  "chat/emotionType": G["emotionType"]
  "chat/inputDisableFlg": G["inputDisableFlg"]
  "chat/topic": G["topic"]
}

export interface M {
  pushChatLog: ChatMessage
  popChatLog: void
  changeChatLogs: Array<Transcript>
  setEmotionType: number
  setParentCategoryID: string
  setInputFlg: boolean
  switchEmotion: string
  setTopic: string
}
export interface RM {
  "chat/pushChatLog": M["pushChatLog"]
  "chat/popChatLog": M["popChatLog"]
  "chat/changeChatLogs": M["changeChatLogs"]
  "chat/setEmotionType": M["setEmotionType"]
  "chat/setParentCategoryID": M["setParentCategoryID"]
  "chat/setInputFlg": M["setInputFlg"]
  "chat/switchEmotion": M["switchEmotion"]
  "chat/setTopic": M["setTopic"]
}

export interface A {
  addChatMessage: ChatMessage
  deleteFinalChat: void
  createDefaultMessage: string
  createErrorMessage: void
  makeInputAreaDisable: boolean
  displayQuestionSelect: string
  selectMainCategory: {
    categoryType: [string, string]
    needUserBallon: boolean
  }
  selectSubCategory: {
    categoryType: [string, string, string]
    needUserBallon: boolean
  }
  submit: string
  updateTranscripts: Array<Transcript>
  askToDialogflow: string
  changeEmotion: number
  evacuateCurrentEmotion: string
  connectToIVR: void
}
export interface RA {
  "chat/addChatMessage": A["addChatMessage"]
  "chat/deleteFinalChat": A["deleteFinalChat"]
  "chat/createDefaultMessage": A["createDefaultMessage"]
  "chat/createErrorMessage": A["createErrorMessage"]
  "chat/makeInputAreaDisable": A["makeInputAreaDisable"]
  "chat/displayQuestionSelect": A["displayQuestionSelect"]
  "chat/selectMainCategory": A["selectMainCategory"]
  "chat/selectSubCategory": A["selectSubCategory"]
  "chat/submit": A["submit"]
  "chat/updateTranscripts": A["updateTranscripts"]
  "chat/askToDialogflow": A["askToDialogflow"]
  "chat/changeEmotion": A["changeEmotion"]
  "chat/evacuateCurrentEmotion": A["evacuateCurrentEmotion"]
  "chat/connectToIVR": A["connectToIVR"]
}
