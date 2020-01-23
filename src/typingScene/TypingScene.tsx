import React, {useEffect} from "react"
import {BASE_CONFIG} from "../App"
import {Game} from "../libraries/Game/Game"
import {observer} from "mobx-react-lite"
import {typingStore} from "./TypingStore"
import {ActiveWord} from "./activeWord/ActiveWord"
import * as Phaser from "phaser"

enum ASSETS {
    Tower = "tower",
    Archer = "archer",
    Mage = "mage",
    Rogue = "rouge",
    Fighter = "fighter",
    Necromancer = "necromancer"
}

const preload = (scene: Phaser.Scene) => {
    scene.load.image(ASSETS.Tower, "/assets/tower_round.svg")
    scene.load.image(ASSETS.Mage, "/assets/robe.png" )
    scene.load.image(ASSETS.Archer, "/assets/Archer.png")
    scene.load.image(ASSETS.Rogue, "/assets/rogue.png")
    scene.load.image(ASSETS.Fighter, "/assets/swordwoman.png")
    scene.load.image(ASSETS.Necromancer, "/assets/necromancer.png")
}

// ENEMY TOWERS
// PLAYER TOWERS


let player: Phaser.GameObjects.Sprite
let cursors: Phaser.Types.Input.Keyboard.CursorKeys
const create = (scene: Phaser.Scene) => {

    player = scene.add.sprite(300, 400, ASSETS.Necromancer)
    player.displayWidth = 96
    player.scaleY = player.scaleX

    scene.input.keyboard.enableGlobalCapture()
    cursors = scene.input.keyboard.createCursorKeys()

    scene.input.keyboard.on("keydown", (e: { key?: string }) => {
            if (cursors.up?.isDown || cursors.down?.isDown || cursors.right?.isDown || cursors.left?.isDown || !e.key)
                return
            else
                onTyping(e.key || "")
        }
    )
    scene.add.image(100, 100, ASSETS.Tower)
    scene.add.image(100, 300, ASSETS.Tower)
    scene.add.image(100, 500, ASSETS.Tower)

    scene.add.image(1300, 100, ASSETS.Tower)
    scene.add.image(1300, 300, ASSETS.Tower)
    scene.add.image(1300, 500, ASSETS.Tower)

    const fighter = scene.add.sprite(400, 200, ASSETS.Fighter)
    fighter.setScale(.05)
    // fighter.displayWidth = 96
    // fighter.scaleX = fighter.scaleY
    const rogue =  scene.add.sprite(800, 200, ASSETS.Rogue)
    rogue.setScale(.05)
    // // rogue.displayWidth = 96
    // // rogue.scaleX = rogue.scaleY
    const mage = scene.add.sprite(400, 400, ASSETS.Mage)
    mage.setScale(.05)
    // // mage.displayWidth = 96
    // // mage.scaleX = mage.scaleY
    const archer = scene.add.sprite(800, 400, ASSETS.Archer)
    archer.setScale(.05)
    // archer.displayWidth = 96
    // archer.scaleX = archer.scaleY

}
const update = (scene: Phaser.Scene) => {
    if (cursors.up?.isDown) {
        player.y -= 10
    }
    if (cursors.down?.isDown) {
        player.y += 10
    }
    if (cursors.left?.isDown) {
        player.x -= 10
    }
    if (cursors.right?.isDown) {
        player.x += 10
    }
}


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
                preload(this as unknown as Phaser.Scene)
            },
            create: function () {
                create(this as unknown as Phaser.Scene)
            },
            update: function () {
                update(this as unknown as Phaser.Scene)
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