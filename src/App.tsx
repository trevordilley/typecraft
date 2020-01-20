import React from "react"
import * as Phaser from "phaser"
import {TypingScene} from "./typingScene/TypingScene"

export const BASE_CONFIG: Phaser.Types.Core.GameConfig = {
    title: "TypeCraft",
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    backgroundColor: '#ffffff'
}

const App = () => {
    return (
        <TypingScene/>
    )
}


export default App
