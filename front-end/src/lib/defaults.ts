import axios from "axios"

// NetWork
const DIALOGFLOW_SERVER_URL = "http://127.0.0.1:5000"
export const ASR_SERVER_URL = "http://localhost:7000/"
export const CLIENT_DIALOGFLOW = axios.create({
  baseURL: DIALOGFLOW_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  withCredentials: true,
  timeout: 100000
})
export const CLIENT_ASR = axios.create({
  baseURL: ASR_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  timeout: 100000
})

// Web Audio API Paremeters
export const BUFFER_SIZE = 1024
export const NUM_OF_INPUT_CHANNELS = 1
export const NUM_OF_OUTPUT_CHANNELS = 1

// Default Message
export const WELCOME_MSG = "こんにちは！！"
export const FALLBACK1_MSG = "失敗した"
export const FALLBACK2_MSG = "またもや失敗"
export const IS_FINAL_MSG = "もうええ？"
export const END_MSG = "じゃ、バイバイ"
export const SERVER_ERR_MSG = "サーバーエラー"
export const MAIN_SUB_CATEGORY_FALLBACK = "うわーー"

// 不要メッセージ
export const MAIN_SUB_CATEGORY_ITEM_OTHER = ""
export const MAIN_CATEGORY_ITEM_IDDM = ""
export const MAIN_CATEGORY_ITEM_LIFE_STYLE = ""
export const MAIN_CATEGORY_ITEM_TREATMENT = ""
export const MAIN_CATEGORY_ITEM_DISASTER = ""
export const SUB_CATEGORY_ITEM_IDDM_DIABETIC = ""
export const SUB_CATEGORY_ITEM_IDDM_INSULIN = ""
export const SUB_CATEGORY_ITEM_IDDM_INFORMATION = ""
export const SUB_CATEGORY_ITEM_IDDM_RELATIONSHIP = ""
export const SUB_CATEGORY_ITEM_IDDM_HYPOGLYCEMIA = ""
export const SUB_CATEGORY_ITEM_IDDM_PERIDONTAL_DISEASE = ""
export const SUB_CATEGORY_ITEM_IDDM_QUESIONNAIRE = ""
export const SUB_CATEGORY_ITEM_LIFE_STYLE_PREGNANCY = ""
export const SUB_CATEGORY_ITEM_LIFE_STYLE_SCHOOL_LIFE = ""
export const SUB_CATEGORY_ITEM_LIFE_STYLE_JOB = ""
export const SUB_CATEGORY_ITEM_LIFE_STYLE_SOCIAL_SOCIETY = ""
export const SUB_CATEGORY_ITEM_TREATMENT_CURRENTLY = ""
export const SUB_CATEGORY_ITEM_TREATMENT_FUTURE = ""
export const SUB_CATEGORY_ITEM_TREATMENT_SPECIALIST = ""
export const SUB_CATEGORY_ITEM_DISASTER_MEDICINE = ""
export const SUB_CATEGORY_ITEM_DISASTER_FOOD = ""
export const SUB_CATEGORY_ITEM_DISASTER_PLACE = ""
export const SUB_CATEGORY_ITEM_DISASTER_CAUTION = ""
export const SUB_CATEGORY_ITEM_DISASTER_PREPARTION = ""
export const QUESTIONS_NOT_IN_ABOVE = ""
export const YES = "はい"
export const NO = "いいえ"
