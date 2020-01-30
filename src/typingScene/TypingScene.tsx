import React, {useEffect, useState} from "react"
import {BASE_CONFIG} from "../App"
import {Game} from "../libraries/Game/Game"
import {observer} from "mobx-react-lite"
import {typingStore} from "./typing/TypingStore"
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
import {typed} from "./typing/Typing"
import {HealthComponent, HealthComponentKind} from "./components/HealthComponent"
import {add, entityStore} from "./EntityStore"
import {Player, playerStore, SpawnDirection, SpawnPoint} from "./players/PlayerStore"
import {randomInt} from "../Util"
import {spawn} from "./components/SpawnedComponent"
import {PositionComponent, PositionComponentKind} from "./components/PositionComponent"
import {debugStore} from "./DebugStore"
import {timeStore} from "./TimeStore"


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

export const TypingScene = observer(() => {

    // on unmount
    useEffect(() => {
        return () => {
            document.onkeypress = null
        }
    }, [])

    /***********************
     Systems
     ***********************/

        // Position System (make sprites respect the x,y on the entity itself)
    const positionSystem = {
            allOf: [SpriteComponentKind, PositionComponentKind],
            execute: (entities: (Partial<SpriteComponent> & Partial<PositionComponent> & Entity)[]) => {
                return entities.map(e => {
                    e.sprite!.x = e.x!
                    e.sprite!.y = e.y!
                    return e
                })
            }
        }

    // Movement System
    const movementSystem = {
        allOf: [PositionComponentKind, MovementComponentKind],
        execute: (entities: (
            Partial<PositionComponent> &
            Partial<MovementComponent> &
            Partial<SpriteComponent> &
            Entity)[], dt: number) => {
            return entities.map(e => {
                if (!e.destination) {
                    return e
                }

                const p = new Phaser.Math.Vector2(e.x!, e.y!)
                const d = new Phaser.Math.Vector2(e.destination!.x, e.destination!.y)

                // They have reached their destination
                if (d.distance(p) < 5) {
                    return {...e, destination: undefined}
                }

                const dir = d.subtract(p).normalize().angle()
                const deg = dir * (180/Math.PI)


                // Change sprite orientation, assuming
                // the sprite is always facing to the "right"
                if(e.sprite) {
                    if( deg >= 90 && deg <= 270) {
                        e.sprite.setFlipX(true)
                    } else {
                        e.sprite.setFlipX(false)
                    }
                }

                const x = dt * Math.cos(dir) * e.speed! + e.x!
                const y = dt * Math.sin(dir) * e.speed! + e.y!
                return {...e, x, y}
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



    const TypingSceneConfig = {
        ...BASE_CONFIG,
        scene: {


            /***********************
             PRELOAD
             ***********************/
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


            /***********************
             CREATE
             ***********************/
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
                        debugStore.debugLastKeyPressed = e.key
                        if (e.key === "`") {
                            debugStore.debugUiEnabled = !debugStore.debugUiEnabled
                            return
                        }
                        if(e.key === "Escape") {
                            timeStore.togglePause()
                        }
                        if (cursors.up?.isDown || cursors.down?.isDown || cursors.right?.isDown || cursors.left?.isDown || !e.key || e.key === "Shift")
                            return
                        else if (e.key) {
                            onTyping(e.key)
                        }
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

            },

            /***********************
             UPDATE
             ***********************/
            update: function (timeStep: number, dt: number) {
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

                const deltaTime = dt * timeStore.dilation
                const entities = entityStore.entities
                entityStore.entities = engine(
                    entities,
                    [
                        positionSystem,
                        movementSystem,
                        stillAliveSystem
                    ],
                    deltaTime
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
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                <div>
                    Points: {typingStore.points}
                    <br/>
                    Current Streak: {typingStore.currentStreak}
                    <br/>
                    Streak Points: {typingStore.streakPoints}
                </div>
                <ul>
                    <li>Entity Count: {entityStore.entities.length}</li>
                    <li>Last Key: {debugStore.debugLastKeyPressed}</li>
                    <li>Debug UI Enabled: {debugStore.debugUiEnabled ? "True" : "False"}</li>
                    <li>Paused: {timeStore.paused}</li>
                    <li>Time Dilation: {timeStore.dilation}</li>
                    <li><button onClick={debugStore.randomSpawn}>Random Spawn</button></li>
                </ul>
                <div>
                    <ul>
                        <li>Typing creates batch of minions</li>
                        <li>Tab changes lane</li>
                        <li>Streaks allow purchase of upgrades to minion squad</li>
                        <li>Typing is actually in a time window</li>
                    </ul>
                </div>
            </div>
            {
                debugStore.debugUiEnabled &&
                entityStore.entities.map(entity => (<DebugEntity entity={entity}/>))
            }
        </Game>
    )
})

const DebugEntity: React.FC<{
    entity: Entity &
        Partial<PositionComponent> &
        Partial<MovementComponent> &
        Partial<HealthComponent>
}> = ({entity}) => {
    const [isVisible, setIsVisible] = useState(false)
    return (
        <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            style={{
                position: "absolute",
                width: 200,
                color: "white",
                left: entity.x ?? 0,
                top: entity.y ?? 0,
                opacity: (isVisible) ? 1 : 0
            }}>
            <ul>
                <li>components: {Array.from(entity.components).join(",")}</li>
                <li>(x,y): {entity.x}, {entity.y}</li>
                {entity.destination && <li>destination: ${entity.destination.x}, ${entity.destination.y}</li>}
                <li>hp: {entity.hitPoints}/{entity.maxHitPoints}</li>
            </ul>
        </div>
    )
}

