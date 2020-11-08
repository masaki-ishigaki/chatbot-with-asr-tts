export interface S {
  isLoaded: boolean
  voiceUIMode: boolean
}

export interface G {
  isLoaded: boolean
  voiceUIMode: boolean
}
export interface RG {
  "setting/isLoaded": G["isLoaded"]
  "setting/voiceUIMode": G["voiceUIMode"]
}

export interface M {
  setLoadingState: boolean
  changeVUIMode: void
}
export interface RM {
  "setting/setLoadingState": M["setLoadingState"]
  "setting/changeVUIMode": M["changeVUIMode"]
}

export interface A {
  changeLoadingState: boolean
}
export interface RA {
  "setting/changeLoadingState": A["changeLoadingState"]
}
