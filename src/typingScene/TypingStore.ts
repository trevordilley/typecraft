import {observable} from "mobx"

class TypingStore {
    @observable
    targetWord: string = "Hello, World"

    @observable
    currentWord: string = ""

    @observable
    points: number = 0

    @observable
    currentStreak: number = 0

    @observable
    streakPoints: number = 0
}

export const typingStore:TypingStore = new TypingStore()
