import React, {useEffect} from "react"
import {BASE_CONFIG} from "../App"
import {Game} from "../Game"
import {observer} from "mobx-react-lite"
import {typingStore} from "./TypingStore"
import {ActiveWord} from "./activeWord/ActiveWord"
const preload = (scene: Phaser.Scene) => {
    console.log("preloaded")
}
const create = (scene: Phaser.Scene) => {
}
const update = (scene: Phaser.Scene) => {

}

const onKeyGlobalPress = (character: string) => {
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
document.onkeypress = (ev: KeyboardEvent) =>
    onKeyGlobalPress(ev.key)

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