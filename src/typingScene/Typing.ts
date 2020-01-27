export interface TypingState {
    points: number,
    currentStreak: number,
    character: string,
    targetWord: string,
    currentWord: string,
    nextWord: boolean
}

export const typed = (typingState: TypingState): TypingState => {
    const {targetWord, character} = typingState
    let {points, currentStreak, currentWord, nextWord} = typingState
    const newWord = `${currentWord}${character}`
    if (targetWord.startsWith(newWord)) {
        // Cool we got the correct character
        points += 1
        currentStreak += 1
        currentWord = newWord
        nextWord = currentWord === targetWord;
    } else {
        currentStreak = 0
    }
    return {targetWord, nextWord, currentWord, character, currentStreak, points}
}

