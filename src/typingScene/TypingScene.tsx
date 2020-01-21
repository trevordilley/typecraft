import React, {useEffect} from "react"
import {BASE_CONFIG} from "../App"
import {Game} from "../Game"
import {observer} from "mobx-react-lite"
import {typingStore} from "./TypingStore"
import {ActiveWord} from "./activeWord/ActiveWord"
import * as Phaser from 'phaser'

const preload = (scene: Phaser.Scene) => {
    scene.load.svg(ASSETS.Tower, '/assets/tower_round.svg')
}

// ENEMY TOWERS
// PLAYER TOWERS

enum ASSETS {
    Tower = "tower"
}
const create = (scene: Phaser.Scene) => {
    scene.add.image(100, 100, ASSETS.Tower)
    scene.add.image(100, 300, ASSETS.Tower)
    scene.add.image(100, 500, ASSETS.Tower)

    scene.add.image(700, 100, ASSETS.Tower)
    scene.add.image(700, 300, ASSETS.Tower)
    scene.add.image(700, 500, ASSETS.Tower)

}
const update = (scene: Phaser.Scene) => {

}

const onTyping = (character: string) => {
    const newWord = `${typingStore.currentWord}${character}`

    if(typingStore.targetWord.startsWith(newWord)) {
        // Cool we got the correct character
        typingStore.points += 1
        typingStore.currentStreak += 1
        typingStore.currentWord = newWord
    }
    else {
        typingStore.currentStreak = 0
    }

}

enum KEY_CODE {
    Space="Space",
    Tab="Tab"
}

document.onkeydown = (ev: KeyboardEvent) => {
    ev.preventDefault()
    if(ev.code === KEY_CODE.Space) {
        // create a thing
        console.log("Spacej")
    }
    else if (ev.code === KEY_CODE.Tab) {
        // Choose a thing
        console.log("Tabkj")
    }
    else {
        onTyping(ev.key)
    }
}

export const TypingScene = observer(() => {

    // on unmount
    useEffect(() => {
        return () => {
            document.onkeypress = null
        }
    }, [])

    const TypingSceneConfig = {...BASE_CONFIG,
        scene: {
            preload: function() {preload(this as unknown as Phaser.Scene)},
            create: function() {create(this as unknown as Phaser.Scene)},
            update: function() {update(this as unknown as Phaser.Scene)}
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