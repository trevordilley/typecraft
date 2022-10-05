import {DeathState} from "../components/DeathComponent";
import {Attack} from "../components/CombatantComponent";
import {AnimationName, AnimData, animName} from "../components/SpriteComponent";
import {edict} from "@edict/core";
import {wordLibrary} from "../typing/TypingStore";
import {Lane, LanePosition, Player, playerStore, SpawnDirection, SpawnPoint} from "../players/PlayerStore";
import Phaser from "phaser";
import {Assets} from "../TypingScene";
import {entity} from "../entities/minions/Entity";
import {Adventurer} from "../entities/minions/Adventurer";
import {spawn} from "../components/SpawnedComponent";
import {Witch} from "../entities/minions/Witch";
import {Builder} from "../entities/minions/Builder";
import {Gladiator} from "../entities/minions/Gladiator";
import {Dwarf} from "../entities/minions/Dwarf";
import {Tower} from "../entities/towers/Tower";

type SceneSchema = {
}

type DebugSchema = {
  debugUiEnabled: boolean,
  debugLastKeyPressed?: string
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

type ComponentSchema = {
  x: number,
  y: number
  commander: Player,
  attack: Attack
  hitPoints: number,
  maxHitPoints: number,
  damages: number[]
  deathState: DeathState
  speed: number,
  destination: { x: number, y: number }
  finalDestination: { x: number, y: number }
  sprite: Phaser.GameObjects.Sprite,
  asset: Assets
  animData: AnimData
}

type PlayerSchema = {
  currentLanePosition: LanePosition,
  topLane: Lane,
  bottomLane: Lane,
  tint: number,
  towerPoints: number,
  spawnSquad: boolean,
  switchLanes: boolean
}

type Schema = ComponentSchema & TimeSchema & TypingSchema & SceneSchema & InputSchema & PlayerSchema & DebugSchema



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
   },
})).enact( {
  then: () => {
    insert({Player: {switchLanes: true}})
  }})

rule("Escape Key toggles game pause", ({escapePressed}) => ({
  Input: {
    escapePressed
  },
  Time: {
    isPaused: {then: false}
  }
})).enact( {
  then: ({Time}) => {
    insert({
      Time: {
        isPaused: !Time.isPaused
      }})
  }
})

rule("Pausing the game dilates time", ({ isPaused}) => ({
  Time: {
    isPaused,
    timeDilation: {then: false},
  }
})).enact( {
  then: ({Time}) => {
    insert({
      Time: {
        timeDilation: Time.isPaused ? 0.1 : 1
      }})
  }
})

rule("Non special key is a typed character", ({upPressed, downPressed, leftPressed, rightPressed, shiftPressed, keyPressed}) =>({
  Input: {
    upPressed, downPressed, leftPressed, rightPressed, shiftPressed, keyPressed
  }
})).enact({
  when: ({Input: {upPressed, downPressed, leftPressed,  rightPressed, shiftPressed, keyPressed, }}) =>
    !(upPressed || downPressed || leftPressed || rightPressed ||  !keyPressed || shiftPressed),
  then: ({Input}) => {
    insert({
      Typing: {
        currentCharacter: Input.keyPressed
      }
    })
  }
})

rule("When it's time for the next word, spawn a squad and change the word", ({nextWord, currentLanePosition}) => ({
  Typing: {
    nextWord,
    targetWordIdx: {then: false},
  },
  Player: {
    currentLanePosition
  }
})).enact({
  when: ({Typing}) => Typing.nextWord,
  then: ({Typing: {targetWordIdx}}) => {
    const idx = (targetWordIdx + 1) %  wordLibrary.length

    insert({
      Typing:{
        nextWord: false,
        targetWordIdx: idx,
      },
      Player: {
        spawnSquad: true
      }
    })
  }
})

rule("Switch lanes when signaled to switch lanes", () => ({
  $player: {
    switchLanes: {then: false},
    currentLanePosition: {then: false}
  }
})).enact({
  when: ({$player: {switchLanes}}) => switchLanes,
  then: ({$player}) => {
    const currentLanePosition = $player.currentLanePosition === LanePosition.TOP ? LanePosition.TOP : LanePosition.BOTTOM
    insert({
     [$player.id]: {
       currentLanePosition,
       switchLanes: false
     }
    })
  }
})

rule("Spawn a squad when a player should spawn a squad", ({tint, towerPoints, currentLanePosition, topLane, bottomLane}) => ({
  $player: {
    spawnSquad: {then: false},
    currentLanePosition,
    topLane,
    bottomLane,
    tint,
    towerPoints
  }
})).enact({
  when: (({$player: {spawnSquad}}) => spawnSquad),
  then: ({$player}) => {

    const {id, currentLanePosition, topLane, bottomLane} = $player
    const lane = currentLanePosition === LanePosition.TOP ? topLane : bottomLane

    insert({
      [id]: {
         spawnSquad: false,
         ...entity(spawn(Adventurer(70, 100, $player), lane)),
         ...entity(spawn(Witch(100, 120, $player), lane)),
         ...entity(spawn(Builder(50, 80, $player), lane)),
         ...entity(spawn(Gladiator(90, 90, $player), lane)),
         ...entity(spawn(Dwarf(90, 70, $player), lane)),
      }
    })
  }
})


rule("When the target word index changes, change the target word", ({targetWordIdx}) => ({
  Typing: {
    targetWordIdx
  }
  })
).enact( {
  then: ({Typing: {targetWordIdx}}) => {
    insert({
      Typing: {
        targetWord: wordLibrary[targetWordIdx]
      }
    })
  }
})

rule("When position changes, update the sprite", ({x, y, sprite}) => ({
  $entity: {
    x,
    y,
    sprite
  }
})).enact({
  then: ({$entity: {x, y, sprite}}) => {
    sprite.x = x
    sprite.y = y
  }
})

rule("Sprites without a destination are idle animating", ({finalDestination, sprite, asset}) => ({
  $entity: {
    finalDestination,
    sprite,
    asset
  }
})).enact({
  when:({$entity: { finalDestination}}) => finalDestination === undefined,
  then: ({$entity: {sprite, asset}}) => {
    sprite.anims.play(animName(AnimationName.IDLE, asset), true)
  }
})

const tlTower = entity(Tower(100, 100, SpawnDirection.RIGHT))
const blTower = entity(Tower(100, 400, SpawnDirection.RIGHT))

const trTower = entity(Tower(1100, 100, SpawnDirection.LEFT))
const brTower = entity(Tower(1100, 400, SpawnDirection.LEFT))
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
  },
  Debug: {
    debugUiEnabled:  false,
    debugLastKeyPressed:  undefined
  },
  Player: {
   topLane: {
     origin: tlTower as unknown as SpawnPoint,
     destination: trTower as unknown as SpawnPoint
   },
   bottomLane: {
     origin: blTower as unknown as SpawnPoint,
     destination: brTower as unknown as SpawnPoint
   },
   currentLanePosition: LanePosition.TOP,
   tint: 0xaaffaa,
   towerPoints: 0
  },
  Opponent: {
   topLane: {
     origin: trTower as unknown as SpawnPoint,
     destination: tlTower as unknown as SpawnPoint
   },
   bottomLane: {
     origin: brTower as unknown as SpawnPoint,
     destination: blTower as unknown as SpawnPoint
   },
   currentLanePosition: LanePosition.TOP,
   tint: 0xffaaaa,
   towerPoints: 0
  }
})
