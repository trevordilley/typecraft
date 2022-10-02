import {DeathState} from "../components/DeathComponent";
import {HealthComponent} from "../components/HealthComponent";
import {CombatantComponent} from "../components/CombatantComponent";
import {PositionComponent} from "../components/PositionComponent";
import {MovementComponent} from "../components/MovementComponent";
import {AnimData, SpriteComponent} from "../components/SpriteComponent";
import {TypingState} from "../typing/Typing";
import {edict} from "@edict/core";
import {wordLibrary} from "../typing/TypingStore";


type Schema = {
  deltaTime: number

  // Entity Data
  position: PositionComponent,
  combatant: CombatantComponent
  health: HealthComponent,
  deathState: DeathState,
  movement: MovementComponent
  sprite: SpriteComponent
  animData: AnimData

  // Typing Data
  keyboardInputStream: string[]
  targetWordIdx: number,
  currentWord: string,
  currentCharacter: string,
  points: number,
  currentStreak: number,
  streakPoints: number,
  targetWord: string,
  nextWord: boolean
}


// export const typed = (typingState: TypingState): TypingState => {
//   const {targetWord, character} = typingState
//   let {points, currentStreak, currentWord, nextWord} = typingState
//   const newWord = `${currentWord}${character}`
//   if (targetWord.startsWith(newWord)) {
//     points += 1
//     currentStreak += 1
//     currentWord = newWord
//     nextWord = currentWord === targetWord;
//   } else {
//     currentStreak = 0
//   }
//   return {targetWord, nextWord, currentWord, character, currentStreak, points}
// }
export const session = edict<Schema>()
const { fire, insert, rule} = session
rule("matching characters increase points, missed characters break streaks", ({currentCharacter, targetWord}) => ({
  Typing: {
    currentWord: {then: false},
    targetWord,
    currentCharacter,
    currentStreak: {then: false},
    points: {then: false},
    nextWord: {then: false}
  }
})).enact({
  then: ({Typing}) => {
    const {targetWord, currentWord, currentCharacter, points, currentStreak} = Typing
    const newWord = `${currentWord}${currentCharacter}`
    if(targetWord.startsWith(newWord)) {
      insert({
        Typing: {
          points: points + 1,
          currentStreak: currentStreak + 1,
          currentWord: newWord,
          nextWord: newWord === targetWord
        }
      })
    } else {
      insert({Typing: { currentStreak: 0 }})
    }
  }
})

// Insert the initial data
insert({
  Typing: {
    currentWord: "",
    targetWord: wordLibrary[0],
    currentStreak: 0,
    points: 0,
    nextWord: false
  },
  Time: {
    deltaTime: 0
  }
})
