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
import {HealthComponent, HealthComponentKind} from "./components/HealthComponent"
import {add, entityStore} from "./EntityStore"
import {playerStore, SpawnDirection, SpawnPoint} from "./PlayerStore"

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
    if (nextWord) {
        typingStore.nextWord()
        typingStore.currentWord = ""
        add(Adventurer(70, 100))
        add(Minotaur(100, 100))
        add(Witch(100, 120))
        add(Builder(50, 80))
        add(Gladiator(90, 90))
        add(Dwarf(90, 70))
    } else {
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
                        if (cursors.up?.isDown || cursors.down?.isDown || cursors.right?.isDown || cursors.left?.isDown || !e.key || e.key === "Shift")
                            return
                        else
                            onTyping(e.key || "")
                    }
                )

                const tlTower = add(Tower(100, 100, SpawnDirection.RIGHT))
                const blTower = add(Tower(100, 400, SpawnDirection.RIGHT))
                playerStore.player1 = {
                    topSpawn: tlTower as unknown as SpawnPoint,
                    bottomSpawn: blTower as unknown as SpawnPoint,
                    currentSpawn: tlTower as unknown as SpawnPoint
                }

                const trTower = add(Tower(1100, 100, SpawnDirection.LEFT))
                const brTower = add(Tower(1100, 400, SpawnDirection.LEFT))
                playerStore.player2 = {
                    topSpawn: trTower as unknown as SpawnPoint,
                    bottomSpawn: brTower as unknown as SpawnPoint,
                    currentSpawn: trTower as unknown as SpawnPoint
                }


                const x = () => Math.floor(Math.random() * Math.floor(300))
                const y = () => Math.floor(Math.random() * Math.floor(600))

                add(Adventurer(x(), y()))
                add(Dwarf(x(), y()))
                add(Builder(x(), y()))
                add(Witch(x(), y()))
                add(Gladiator(x(), y()))
                add(Minotaur(x(), y()))
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
                    allOf: [SpriteComponentKind, MovementComponentKind],
                    execute: (entities: (Partial<SpriteComponent> & Partial<MovementComponent> & Entity)[]) => {
                        return entities.map(e => {
                            e.sprite!.x += e.speed!
                            return e
                        })
                    }
                }

                // Still Alive System
                const stillAliveSystem = {
                    allOf: [HealthComponentKind],
                    execute: (entities: (Partial<HealthComponent> & Entity)[]) => {
                        return entities.filter(e => e.hitPoints! >= 0)
                    }
                }
                const entities = entityStore.entities
                entityStore.entities = engine(entities,
                    [
                        movementSystem,
                        stillAliveSystem
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
            <div style={{display: "flex", flexDirection: "row"}}>
            <div>
                Points: {typingStore.points}
                <br/>
                Current Streak: {typingStore.currentStreak}
                <br/>
                Streak Points: {typingStore.streakPoints}
            </div>
            <div>
                <ul>
                    <li>Typing creates batch of minions</li>
                    <li>Tab changes lane</li>
                    <li>Streaks allow purchase of upgrades to minion squad</li>
                    <li>Portal is open allows typing. Then it closes and you spend
                        your streak points.
                    </li>
                </ul>
            </div>
            </div>
        </Game>
    )
})