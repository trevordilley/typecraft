import {action, computed, observable} from "mobx"


export const wordLibrary: string[] = [
    "Clojure",
    "Elm",
    "Erlang",
    "Haskell",
    "Elixer",
    "Ocaml",
    "Kotlin",
    "ReasonML",
    "Scala",
    "Eta",
    "Idris",
    "Racket",
    "Scheme",
    "APL",
]


class TypingStore {


    @observable
    keyboardInputStream: string[] = []

    @observable
    targetWordIdx: number = 0

    @observable
    wordLibrary: string[] = wordLibrary

    @observable
    currentWord: string = ""

    @observable
    points: number = 0

    @observable
    currentStreak: number = 0

    @observable
    streakPoints: number = 0

    @computed
    get targetWord() {
        return typingStore.wordLibrary[typingStore.targetWordIdx]
    }

    @action
    nextWord() {
        typingStore.targetWordIdx = (typingStore.targetWordIdx + 1) %  typingStore.wordLibrary.length
    }
}

export const typingStore:TypingStore = new TypingStore()
