export const WELCOME_MSG = "こんにちは！！"
export const FALLBACK1_MSG = "失敗した"
export const FALLBACK2_MSG = "またもや失敗"
export const IS_FINAL_MSG = "もうええ？"
export const END_MSG = "じゃ、バイバイ"
export const SERVER_ERR_MSG = "サーバーエラー"
export const MAIN_SUB_CATEGORY_FALLBACK = "うわーー"

export const PROMPT_SELECT_MSG = "次"
export const PROMPT_NEXT_QUESTION = "次の次"

/**
 * Get default message bot speaks according to input type
 * @param: default message type
 * @param: language code which is defined in ../types.ts
 * @return: [0] -> speaker, [1] -> message
 */
export function getDefaultMessage(type: string): [string, string] {
  switch (type) {
    case "welcome":
      // Message when starting to chat with Bot
      return ["bot-greet", WELCOME_MSG]
    case "others-is-selected":
      // Message after 'Others' is selected in list ballon (Main or Sub Category)
      return ["bot-fail", FALLBACK1_MSG]
    case "failed-to-guide":
      // Message after 'Not in the above' is selected in list ballon (FAQ)
      return ["bot-fail", FALLBACK2_MSG]
    case "is-chat-finished":
      // Message after bot answers user's question
      return ["bot-ask-to-finish-chat", IS_FINAL_MSG]
    case "goodbye":
      // Message before bot finish chatting with user
      return ["bot-byebye", END_MSG]
    case "error":
      // Message before bot finish chatting with user
      return ["bot-error", SERVER_ERR_MSG]
    case "fallback":
      // Fallback message
      return ["bot-fail", MAIN_SUB_CATEGORY_FALLBACK]
    default:
      return ["bot-greet", WELCOME_MSG]
  }
}

/**
 * Get default message bot speaks before list ballon (main category) is displayed
 * @param: timing when list ballon is displayed
 * @param: language code which is defined in ../types.ts
 * @return: [0] -> speaker, [1] -> message
 */
export function getIgnitionMessage(type: string): [string, number] {
  switch (type) {
    case "new":
      // At the beginning of chat
      return [PROMPT_SELECT_MSG, 1000]
    case "next-query":
      // After user decide to continue chat
      return [PROMPT_NEXT_QUESTION, 0]
    default:
      return [PROMPT_SELECT_MSG, 1000]
  }
}

/**
 * Get default message to bot speak according to input type
 * @param: default message type
 * @return: [0] -> speaker, [1] -> message
 * NOTE:
 * 'speaker' is action which bot (or user) takes
 * <Detail of each speaker>
 * 'bot-greet' -> Bot talks to user at first and asks user to select user type
 * 'bot-thinking' -> Bot pretends to think when it takes a little time to display next ballon
 * 'bot-ask-to-select' -> Bot ask user to select main category after user selects user type
 * 'bot-main-category' -> Main category
 * 'bot-sub-category' -> Sub cageory
 * 'bot-faq' -> Questions
 * 'bot-fail' -> Bot apologize when user select 'others' or 'not above' in the list ballon
 * 'bot-answer' -> Answer from dialogflow
 * 'bot-link' -> Link ballon is displayed when answer includes external link
 * 'bot-image' -> Image ballon is displayed when answer includes image link
 * 'bot-video' -> Video ballon is displayed when answer includes video link
 * 'bot-byebye' -> Bot says goodbye
 * 'bot-error' -> Server error
 */
export function getBotBallonType(targetSpeaker: string) {
  const speakerForTextBallon = [
    "bot-greet",
    "bot-ask-to-select",
    "bot-fail",
    "bot-answer",
    "bot-ask-to-finish-chat",
    "bot-byebye",
    "bot-error",
    "bot-phone"
  ]
  for (const speaker of speakerForTextBallon) {
    if (targetSpeaker === speaker) {
      return "text"
    }
  }
  if (targetSpeaker === "bot-link") {
    return "link"
  }
  if (targetSpeaker === "bot-image") {
    return "image"
  }
  if (targetSpeaker === "bot-video") {
    return "video"
  }
  if (targetSpeaker === "bot-thinking") {
    return "thinking"
  }
  if (
    targetSpeaker === "bot-main-category" ||
    targetSpeaker === "bot-sub-category" ||
    targetSpeaker === "bot-faq"
  ) {
    return "list"
  }

  return "text"
}

export function isScrollToBottom(targetSpeaker: string): boolean {
  const speakerForScroll = [
    "bot-greet",
    "bot-ask-to-select",
    "bot-main-category",
    "bot-fail",
    "bot-ask-to-finish-chat",
    "bot-byebye"
  ]
  for (const speaker of speakerForScroll) {
    if (targetSpeaker === speaker) {
      return true
    }
  }
  return false
}

export function canBotSpeak(targetSpeaker: string): boolean {
  const speakerNotToSpeak = [
    "bot-thinking",
    "bot-link",
    "bot-image",
    "bot-video",
    "bot-error",
    "user"
  ]
  for (const speaker of speakerNotToSpeak) {
    if (targetSpeaker === speaker) {
      return false
    }
  }
  return true
}
