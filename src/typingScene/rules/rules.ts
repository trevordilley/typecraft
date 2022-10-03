import {DeathState} from "../components/DeathComponent";
import {HealthComponent} from "../components/HealthComponent";
import {CombatantComponent} from "../components/CombatantComponent";
import {PositionComponent} from "../components/PositionComponent";
import {MovementComponent} from "../components/MovementComponent";
import {AnimData, SpriteComponent} from "../components/SpriteComponent";
import {edict} from "@edict/core";
import {wordLibrary} from "../typing/TypingStore";
import {LanePosition, playerStore} from "../players/PlayerStore";

type SceneSchema = {
}

type TimeSchema = {
  deltaTime: number,
  isPaused: boolean,
  timeDilation: number
}

type TypingSchema = {
  keyboardInputStream: string[]
  targetWordIdx: number,
  currentWord: string,
  currentCharacter: string,
  points: number,
  currentStreak: number,
  streakPoints: number,
  targetWord: string,
  nextWord: boolean,
}

type InputSchema = {
    upPressed?: boolean,
    downPressed?: boolean,
    leftPressed?: boolean,
    rightPressed?: boolean,
    spacePressed?: boolean,
    shiftPressed?: boolean,
    escapePressed?: boolean,
    debugPressed?: boolean,
    pauseKeyPressed?: boolean,
    keyPressed?: string
}

type EntitySchema = {
  // Entity Data
  position: PositionComponent,
  combatant: CombatantComponent
  health: HealthComponent,
  deathState: DeathState,
  movement: MovementComponent
  sprite: SpriteComponent
  animData: AnimData

}

type PlayerSchema = {
  lane: LanePosition,
  tint: string,
  towerPoints: number,
}

type Schema = EntitySchema & TimeSchema & TypingSchema & SceneSchema & InputSchema





// Let's take a gradual strategy. Start by migrating input and updating the stores
// as needed, then integrate into React, then take over the stores.
export const session = edict<Schema>()
const { insert, rule} = session
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

rule("Space Key switches lanes", ({spacePressed}) => ({
   Input: {
     spacePressed
   }
})).enact( {
  then: () => {
    if (playerStore.player1?.currentLanePosition === LanePosition.TOP) {
      playerStore.player1!.currentLanePosition = LanePosition.BOTTOM
    } else {
      playerStore.player1!.currentLanePosition = LanePosition.TOP
    }}
})

rule("Escape Key toggles game pause", ({escapePressed,  isPaused}) => ({
  Input: {
    escapePressed
  },
  Time: {
    isPaused
  }
})).enact( {
  then: ({Time}) => {
    insert({
      Time: {
        isPaused: !Time.isPaused
      }})
  }
})

rule("Pausing the game dilates time", ({timeDilation,  isPaused}) => ({
  Time: {
    isPaused,
    timeDilation,
  }
})).enact( {
  then: ({Time}) => {
    insert({
      Time: {
        timeDilation: Time.isPaused ? 0.1 : 1
      }})
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
  Input: {
    upPressed: false,
    downPressed: false,
    rightPressed: false,
    leftPressed: false,
    escapePressed: false,
    spacePressed: false,
    shiftPressed: false,
    debugPressed: false,
    pauseKeyPressed: false,
  },
  Time: {
    deltaTime: 0,
    isPaused: false,
    timeDilation: 1
  }
})
