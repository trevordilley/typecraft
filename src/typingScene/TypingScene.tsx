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
    const newWord = `${typingStore.currentWord}${character}`

    if (typingStore.targetWord.startsWith(newWord)) {
        // Cool we got the correct character
        typingStore.points += 1
        typingStore.currentStreak += 1
        typingStore.currentWord = newWord
    } else {
        typingStore.currentStreak = 0
    }

}
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

                sceneStore.scene!.add.image(100, 100, TYPING_SCENE_ASSETS.Tower)
                sceneStore.scene!.add.image(100, 400, TYPING_SCENE_ASSETS.Tower)

                sceneStore.scene!.add.image(1100, 100, TYPING_SCENE_ASSETS.Tower)
                sceneStore.scene!.add.image(1100, 400, TYPING_SCENE_ASSETS.Tower)

                entities =
                    [
                        Adventurer(400, 150),
                        Dwarf(450, 150),
                        Builder(500, 150),
                        Witch(550, 150),
                        Gladiator(600, 150),
                        Minotaur(650, 125)
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
                entities = engine(entities,
                    [
                        {
                            allOf: new Set<string>([SpriteComponentKind]),
                            execute: entities => {
                                return entities.map((e: (Entity )) => {
                                    (e.components.get(SpriteComponentKind) as SpriteComponent)!.sprite.x += 10
                                    return e
                                })
                            }
                        }
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