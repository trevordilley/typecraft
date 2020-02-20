import React, {useEffect, useState} from "react"
import {BASE_CONFIG} from "../App"
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
import {AnimationName, animName, SpriteComponent, SpriteComponentKind} from "./components/SpriteComponent"
import {Tower} from "./entities/towers/Tower"
import {MovementComponent, MovementComponentKind} from "./components/MovementComponent"
import {typed} from "./typing/Typing"
import {HealthComponent, HealthComponentKind} from "./components/HealthComponent"
import {add, entityStore} from "./EntityStore"
import {Lane, LanePosition, Player, playerStore, SpawnDirection, SpawnPoint} from "./players/PlayerStore"
import {PositionComponent, PositionComponentKind} from "./components/PositionComponent"
import {debugStore} from "./DebugStore"
import {timeStore} from "./TimeStore"
import {CombatantComponent, CombatantComponentKind} from "./components/CombatantComponent"
import {DeathComponent, DeathComponentKind, DeathState, dying} from "./components/DeathComponent"
import {randomInt} from "../Util"
import {spawn} from "./components/SpawnedComponent"
import Game from "reactified-phaser/Game"
import {engine, Entity} from "@trevordilley/ecs"

export enum Assets {
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

const spawnSquad = (player: Player) => {
    const lane = getLane(player)
    add(spawn(Adventurer(70, 100, player), lane))
    add(spawn(Witch(100, 120, player), lane))
    add(spawn(Builder(50, 80, player), lane))
    add(spawn(Gladiator(90, 90, player), lane))
    add(spawn(Dwarf(90, 70, player), lane))

}
const getLane = (player: Player): Lane =>
    (player.currentLanePosition === LanePosition.TOP) ?
        player.topLane :
        player.bottomLane

// Dummy AI
setInterval(() => {
    if (playerStore.player2) {
        const shouldLaneSwitch = randomInt(100) > 80
        if (shouldLaneSwitch) {
            if (playerStore.player2.currentLanePosition === LanePosition.TOP) {
                playerStore.player2.currentLanePosition = LanePosition.BOTTOM
            } else {
                playerStore.player2.currentLanePosition = LanePosition.TOP
            }
        }
        spawnSquad(playerStore.player2)
    }

}, 3000)

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
        spawnSquad(playerStore.player1!)
        typingStore.currentWord = ""
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
        noneOf: [DeathComponentKind],
        execute: (entities: (
            Partial<PositionComponent> &
            Partial<MovementComponent> &
            Partial<SpriteComponent> &
            Entity)[], dt: number) => {
            return entities.map(e => {
                if (!e.destination) {
                    e.sprite?.anims.play(animName(AnimationName.IDLE, e.asset!), true)
                    return e
                }

                const p = new Phaser.Math.Vector2(e.x!, e.y!)
                const d = new Phaser.Math.Vector2(e.destination!.x, e.destination!.y)

                // They have reached their destination
                if (d.distance(p) < 5) {
                    return {...e, destination: undefined, finalDestination: undefined}
                }

                const dir = d.subtract(p).normalize().angle()
                const deg = dir * (180 / Math.PI)

                // Change sprite orientation, assuming
                // the sprite is always facing to the "right"
                if (e.sprite) {
                    e.sprite?.anims.play(animName(AnimationName.MOVING, e.asset!), true)
                    if (deg >= 90 && deg <= 270) {
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

    const healthSystem = {
        allOf: [HealthComponentKind],
        noneOf: [DeathComponentKind],
        execute: (entities: (Partial<HealthComponent> & Entity)[]) => {
            return entities.map(entity => {
                    const damage = entity.damages!.reduce((c, d) => c + d, 0)
                    entity.damages = []
                    entity.hitPoints! -= damage
                    return (entity.hitPoints! <= 0) ? dying(entity) : entity
                }
            )
        }
    }

    const deathSystem = {
        allOf: [DeathComponentKind],
        execute: (entities: (Partial<SpriteComponent> & Partial<DeathComponent> & Entity)[]) => {

            return entities.map(entity => {
                if (entity.sprite) {
                    if (entity.deathState === DeathState.NEW_DYING) {
                        entity.deathState = DeathState.DYING
                        entity.sprite?.anims.play(animName(AnimationName.DEATH, entity.asset!), true)
                    } else if (entity.deathState === DeathState.DYING) {
                        // getProgress() doesn't seem to sync up with the animations quite correctly
                        // or I have empty frames in the death frames?
                        if (entity.sprite?.anims.getProgress() === 1) {
                            entity.deathState = DeathState.DEAD
                        }
                    } else if (entity.deathState === DeathState.DEAD) {
                        entity.sprite.destroy()
                        entity.components.clear()
                    }
                } else {
                    entity.deathState = DeathState.DEAD
                }
                return entity
            })
        }
    }

    // Likely a system that will need all kinds of optimizations
    // May want to introduce another system which breaks up the positions
    // of Entities into grids so entities don't have to check their
    // distances against all other entities
    // Checking distances could be something we offload to a web-worker
    // potentially
    //
    // UPDATE: Oh yeah, this system tanks perf. Game can only handle around
    // 100 entities because of this big dummy.
    const attackSystem = {
        allOf: [CombatantComponentKind, PositionComponentKind, HealthComponentKind, MovementComponentKind],
        noneOf: [DeathComponentKind],
        execute: (
            entities: (Partial<MovementComponent> & Partial<CombatantComponent> & Partial<PositionComponent> & Partial<HealthComponent> & Entity)[], dt: number) => {

            // Just do it the dummy simple way.
            entities.forEach(e => {
                if (e.attack!.curCooldown > 0) {
                    e.attack!.curCooldown -= dt
                    return e
                }

                entities.forEach(o => {
                    if (e.commander !== o.commander) {
                        const attack = e.attack!
                        const ePos = new Phaser.Math.Vector2(e.x!, e.y!)
                        const oPos = new Phaser.Math.Vector2(o.x!, o.y!)
                        const dist = oPos.distance(ePos)
                        if (dist <= attack!.range) {
                            e.destination = undefined
                            e.attack!.curCooldown = attack.maxCooldown
                            const damage = randomInt(attack.damage)
                            o.damages!.push(damage)
                            return e
                        } else if (!e.destination) {
                            console.log("Moving along now?")
                            console.log(e.finalDestination)
                            e.destination = e.finalDestination
                        }
                    }
                })
            })
            return entities
        }
    }

    const towerClaimPointsSystem = {
        allOf: [MovementComponentKind, CombatantComponentKind],
        noneOf: [DeathComponentKind],
        execute: (
            entities: (Partial<MovementComponent> & Partial<CombatantComponent> & Partial<PositionComponent> & Entity)[]) => {
            return entities.map(e => {
                if (e.finalDestination) {
                    const p = new Phaser.Math.Vector2(e.x, e.y)
                    const d = new Phaser.Math.Vector2(e.finalDestination.x, e.finalDestination.y)
                    const dist = p.distance(d)
                    if (dist < 10) {
                        e.commander!.towerPoints += 1
                        return dying(e)
                    }
                }
                return e
            })
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
                sceneStore.scene!.load.image(Assets.Tower, "/assets/tower_round.svg")
                sceneStore.scene!.load.image(Assets.Mage, "/assets/robe.png")
                sceneStore.scene!.load.image(Assets.Archer, "/assets/Archer.png")
                sceneStore.scene!.load.image(Assets.Rogue, "/assets/rogue.png")
                sceneStore.scene!.load.image(Assets.Fighter, "/assets/swordwoman.png")

                // https://opengameart.org/content/pixel-art-minotaur-sprites
                // Upscale them using this command:
                // convert adventurer-sheet.png -filter point -resize 200% adventurer-sheet-big.png
                sceneStore.scene!.load.spritesheet(Assets.Adventurer, "/assets/adventurer-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })
                sceneStore.scene!.load.spritesheet(Assets.Builder, "/assets/builder-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })
                sceneStore.scene!.load.spritesheet(Assets.Dwarf, "/assets/dwarf-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })
                sceneStore.scene!.load.spritesheet(Assets.Gladiator, "/assets/gladiator-sheet-big.png", {
                    frameWidth: 64,
                    frameHeight: 64
                })
                sceneStore.scene!.load.spritesheet(Assets.Minotaur, "/assets/minotaur-sheet-big.png", {
                    frameWidth: 128,
                    frameHeight: 128
                })
                sceneStore.scene!.load.spritesheet(Assets.Witch, "/assets/witch-sheet-big.png", {
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
                        frames: sceneStore.scene!.anims.generateFrameNumbers(Assets.Adventurer, {
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
                        if (e.key === " ") {
                            if (playerStore.player1?.currentLanePosition === LanePosition.TOP) {
                                playerStore.player1!.currentLanePosition = LanePosition.BOTTOM
                            } else {
                                playerStore.player1!.currentLanePosition = LanePosition.TOP
                            }
                            return
                        }
                        if (e.key === "Escape") {
                            timeStore.togglePause()
                            return
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

                const trTower = add(Tower(1100, 100, SpawnDirection.LEFT))
                const brTower = add(Tower(1100, 400, SpawnDirection.LEFT))
                playerStore.player1 = {
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
                }
                playerStore.player2 = {
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
                        healthSystem,
                        attackSystem,
                        towerClaimPointsSystem,
                        deathSystem
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
                    <h3>
                        Player 1 Points: {playerStore.player1?.towerPoints}
                    </h3>
                    <h3>
                        Player 2 Points: {playerStore.player2?.towerPoints}
                    </h3>
                </div>
                <div>
                    <ul style={{listStyleType: "none"}}>
                        <li>Space changes lane</li>
                        <li>Escape pauses game</li>
                        <li>Backtick ( ` ) sets debug mode </li>
                    </ul>
                </div>
                <div>
                    <h2>Current Streak: {typingStore.currentStreak}</h2>
                </div>
                {debugStore.debugUiEnabled && <div>
                    <ul style={{listStyleType: "none"}}>
                        <li>Entity Count: {entityStore.entities.length}</li>
                        <li>Last Key: {debugStore.debugLastKeyPressed}</li>
                        <li>Paused: {timeStore.paused}</li>
                        <li>Time Dilation: {timeStore.dilation}</li>
                        <li>
                            <button onClick={debugStore.forceSpawn}>Force Spawn</button>
                        </li>
                    </ul>

                </div>}
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
        Partial<DeathComponent> &
        Partial<HealthComponent>
}> = ({entity}) => {
    const [isVisible, setIsVisible] = useState(false)
    const x = entity.x ?? 0
    const y = entity.y ?? 0
    return (
        <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            style={{
                position: "absolute",
                color: "#232323",
                left: x ,
                top: y ,
                opacity: (isVisible) ? 0.85 : 0,
                backgroundColor: "#ededed",
                padding: 8,
                border: "2px solid #44f",
                borderRadius: 2,
            }}>
            <ul style={{
                listStyleType: "none",
            }}>
                <li>components: {Array.from(entity.components).join(",")}</li>
                <li>(x,y): {entity.x!.toFixed(1)}, {entity.y!.toFixed(1)}</li>
                {entity.destination &&
                <li>destination: ${entity.destination.x.toFixed(1)}, ${entity.destination.y.toFixed(1)}</li>}
                <li>hp: {entity.hitPoints}/{entity.maxHitPoints}</li>
                <li>deathState: {entity.deathState}</li>
                <li>{entity.damages?.join(",")}</li>
            </ul>
        </div>
    )
}

