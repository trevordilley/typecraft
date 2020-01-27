import React from "react"
import * as Phaser from "phaser"
import {TypingScene} from "./typingScene/TypingScene"

export const THEME = {
    stageWidth: 1200,
    stageHeight: 600,
    // Really important we use a Mono space font so I can calculate the widths
    // based on the characters of the text.
    typingFont: 'Roboto Mono',
    typingFontSize: 40,
    // PIXEL WIDTH IS DIRECTLY TIED TO
    // THE typingFontSize AND NEEDS TO BE RECALIBRATED
    // IF WE CHANGE IT
    typingPixelWidth: 24
}

export const BASE_CONFIG: Phaser.Types.Core.GameConfig = {
    title: "TypeCraft",
    width: THEME.stageWidth,
    height: THEME.stageHeight,
    type: Phaser.AUTO,
    backgroundColor: '#ffffff'
}

const App = () => {

    return (
        <span
            id={"container"}
            style={{fontFamily: THEME.typingFont}}>
            <TypingScene/>
        </span>
    )
}


export default App
