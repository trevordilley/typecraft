import React, {useEffect} from "react"
import {BASE_CONFIG} from "../App"
import {Game} from "../libraries/Game/Game"
import {observer} from "mobx-react-lite"
import {typingStore} from "./TypingStore"
import {ActiveWord} from "./activeWord/ActiveWord"
import * as Phaser from "phaser"
import {sceneStore} from "../SceneStore"
import {Adventurer} from "./entities/minions/Adventurer"
import {Dwarf} from "./entities/minions/Dwarf"
import {Builder} from "./entities/minions/Builder"
import {Witch} from "./entities/minions/Witch"
import {Gladiator} from "./entities/minions/Gladiator"
import {Minotaur} from "./entities/minions/Minotaur"
import {engine, Entity} from "../ECS/ECS"
import {SpriteComponent, SpriteComponentKind} from "./components/SpriteComponent"
import {Tower} from "./entities/towers/Tower"
import {MovementComponent, MovementComponentKind} from "./components/MovementComponent"
import {typed} from "./Typing"

export enum TYPING_SCENE_ASSETS {
    Tower = "tower",
    Archer = "archer",
    Mage = "mage",
    Rogue = "rouge",
    Fighter = "fighter",
    Necromancer = "necromancer",
    Adventurer = "adventurer",
    Minotaur = "minotaur",
    Witch = "witch",
    Gladiator = "gladiator",
    Dwarf = "dwarf",
    Builder = "builder",
}

const outdoorMap = {
    name: "outdoor",
    imageSrc: "/assets/outdoor.png",
    dataName: "outdoorMap",
    dataSrc: "/assets/outdoor.json"
}

let cursors: Phaser.Types.Input.Keyboard.CursorKeys

const onTyping = (character: string) => {

    const {nextWord, points, currentStreak, currentWord} = typed({
        currentStreak: typingStore.currentStreak,
        currentWord: typingStore.currentWord,
        character,
        nextWord: false,
        targetWord: typingStore.targetWord,
        points: typingStore.points
    })
    typingStore.currentStreak = currentStreak
    typingStore.points = points
    if(nextWord) {
        typingStore.nextWord()
        typingStore.currentWord = ""
    }
    else {
        typingStore.currentWord = currentWord
    }
}

// TODO: Use a MobX Store?
let entities: Entity[] = []
export const TypingScene = observer(() => {

    // on unmount
    useEffect(() => {
        return () => {
            document.onkeypress = null
        }
    }, [])

    const TypingSceneConfig = {
        ...BASE_CONFIG,
        scene: {
            preload: function () {
                sceneStore.scene = this as unknown as Phaser.Scene
                sceneStore.scene!.load.image(TYPING_SCENE_ASSETS.Tower, "/assets/tower_round.svg")
                sceneStore.scene!.load.image(TYPING_SCENE_ASSETS.Mage, "/assets/robe.png")
                sceneStore.scene!.load.image(TYPING_SCENE_ASSETS.Archer, "/assets/Archer.png")
                sceneStore.scene!.load.image(TYPING_SCENE_ASSETS.Rogue, "/assets/rogue.png")
                sceneStore.scene!.load.image(TYPING_SCENE_ASSETS.Fighter, "/assets/swordwoman.png")

                // https://opengameart.org/content/pixel-art-minotaur-sprites
                // Upscale them using this command:
                // convert adventurer-sheet.png -filter point -resize 200% adventurer-sheet-big.png
                sceneStore.scene!.load.spritesheet(TYPING_SCENE_ASSETS.Adventurer, "/assets/adventurer-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })
                sceneStore.scene!.load.spritesheet(TYPING_SCENE_ASSETS.Builder, "/assets/builder-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })
                sceneStore.scene!.load.spritesheet(TYPING_SCENE_ASSETS.Dwarf, "/assets/dwarf-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })
                sceneStore.scene!.load.spritesheet(TYPING_SCENE_ASSETS.Gladiator, "/assets/gladiator-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })
                sceneStore.scene!.load.spritesheet(TYPING_SCENE_ASSETS.Minotaur, "/assets/minotaur-sheet-big.png", {
                    frameWidth: 128,
                    frameHeight: 128
                })
                sceneStore.scene!.load.spritesheet(TYPING_SCENE_ASSETS.Witch, "/assets/witch-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })

                sceneStore.scene!.load.image(outdoorMap.name, outdoorMap.imageSrc)
                sceneStore.scene!.load.tilemapTiledJSON(outdoorMap.dataName, outdoorMap.dataSrc)
            },
            create: function () {
                const map = sceneStore.scene!.make.tilemap({key: outdoorMap.dataName})
                const tiles = map.addTilesetImage("outdoor-tileset", outdoorMap.name)
                map.createStaticLayer(0, tiles, 0, 0)
                map.createStaticLayer(1, tiles, 0, 0)

                sceneStore.scene!.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

                sceneStore.scene!.anims.create({
                        key: "idle",
                        frames: sceneStore.scene!.anims.generateFrameNumbers(TYPING_SCENE_ASSETS.Adventurer, {
                            start: 0,
                            end: 12
                        }),
                        frameRate: 20
                    }
                )


                sceneStore.scene!.input.keyboard.enableGlobalCapture()
                cursors = sceneStore.scene!.input.keyboard.createCursorKeys()

                sceneStore.scene!.input.keyboard.on("keydown", (e: { key?: string }) => {
                        if (cursors.up?.isDown || cursors.down?.isDown || cursors.right?.isDown || cursors.left?.isDown || !e.key)
                            return
                        else
                            onTyping(e.key || "")
                    }
                )

                Tower(100, 100)
                Tower(100, 400)
                Tower(1100, 100)
                Tower(1100, 400)

                const x = () => Math.floor(Math.random() * Math.floor(300))
                const y = () => Math.floor(Math.random() * Math.floor(600))
                entities =
                    [
                        Adventurer(x(), y()),
                        Dwarf(x(), y()),
                        Builder(x(), y()),
                        Witch(x(), y()),
                        Gladiator(x(), y()),
                        Minotaur(x(), y())
                    ]


            },
            update: function () {
                // Use scrollX/Y to move camera around
                // the map.
                if (cursors.up?.isDown) {
                    sceneStore.scene!.cameras.main.scrollY -= 10
                }
                if (cursors.down?.isDown) {
                    sceneStore.scene!.cameras.main.scrollY += 10
                }
                if (cursors.left?.isDown) {
                    sceneStore.scene!.cameras.main.scrollX -= 10
                }
                if (cursors.right?.isDown) {
                    sceneStore.scene!.cameras.main.scrollX += 10
                }


                // Movement System
                const movementSystem = {
                        allOf:  [SpriteComponentKind, MovementComponentKind],
                        execute: (entities: (SpriteComponent & MovementComponent & Entity)[]) => {
                            return entities.map(e => {
                                e.sprite.x += 10
                                return e
                            })
                        }
                    }

                entities = engine(entities,
                    [
                        movementSystem
                    ]
                )
            }
        }
    }


    return (
        <Game config={TypingSceneConfig}>
            <div>
                <ActiveWord
                    targetWord={typingStore.targetWord}
                    currentWord={typingStore.currentWord}
                />
            </div>
            <div>
                Points: {typingStore.points}
                <br/>
                Current Streak: {typingStore.currentStreak}
                <br/>
                Streak Points: {typingStore.streakPoints}
            </div>
        </Game>
    )
})