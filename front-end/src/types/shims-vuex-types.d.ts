import "vuex"
import * as Setting from "../stores/setting/type"
import * as Chat from "../stores/chat/type"
import * as Speech from "../stores/speech/type"

declare module "vuex" {
  type RootState = {
    setting: Setting.S
    query: Chat.S
    speech: Speech.S
  }
  type RootGetters = Setting.RG & Chat.RG & Speech.RG
  type RootMutations = Setting.RM & Chat.RM & Speech.RM
  type RootActions = Setting.RA & Chat.RA & Speech.RA

  type Getters<S, G> = {
    [K in keyof G]: (
      state: S,
      getters: G,
      rootState: RootState,
      rootGetters: RootGetters
    ) => G[K]
  }
  type Mutations<S, M> = {
    [K in keyof M]: (state: S, payload: M[K]) => void
  }
  type ExCommit<M> = <T extends keyof M>(type: T, payload?: M[T]) => void
  type ExDispatch<A> = <T extends keyof A>(type: T, payload?: A[T]) => any
  type ExActionContext<S, A, G, M> = {
    commit: ExCommit<M>
    dispatch: ExDispatch<A>
    state: S
    getters: G
    rootState: RootState
    rootGetters: RootGetters
  }
  type Actions<S, A, G = {}, M = {}> = {
    [K in keyof A]: (ctx: ExActionContext<S, A, G, M>, payload: A[K]) => any
  }

  interface ExStore extends Store<RootState> {
    getters: RootGetters
    commit: ExCommit<RootMutations>
    dispatch: ExDispatch<RootActions>
  }
}
