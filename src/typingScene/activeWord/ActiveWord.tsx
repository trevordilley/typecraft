import React from "react"
import {THEME} from "../../App"

const chars = (id: string, word: string, isCurrent?: boolean) => {
    const lastChar = word.length - 1
    const lastCharClass = `puff-in-bl`
    return word
        .split("")
        .map((c, idx) =>
            <span
                className={(idx === lastChar && isCurrent) ? lastCharClass : ""}
                key={`${idx}-${id}-${c}`}
            >
                {c}
            </span>
        )
}
const Word: React.FC<{ id: string, word: string, isCurrent?: boolean }> =
    ({id, word, isCurrent}) => {
        return (<>{chars(id, word, isCurrent)}</>)
    }


export const ActiveWord: React.FC<{ targetWord: string, currentWord: string }> =
    ({targetWord, currentWord}) => {
        // Needs to be one more pixel than the width of the characters to fit
        // on one line
        const wordPixelWidth = targetWord.length * THEME.typingPixelWidth + 1

        // If we want to move the typing text elsewhere we're going to have to use
        // the grid CSS rule instead of flex
        return (
            <div style={{
                height: THEME.stageHeight,
                width: THEME.stageWidth,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontSize: THEME.typingFontSize
            }}
            >
                <div style={{display: "flex", justifyContent: "center"}}>
                    <div style={{position: "absolute", color: "#ddd", width: wordPixelWidth}}>
                        <Word id={"target"} word={targetWord}/>
                    </div>
                    <div style={{position: "absolute", width: wordPixelWidth}}>
                        <Word id={"current"} word={currentWord} isCurrent={true}/>
                    </div>
                </div>
            </div>
        )

    }