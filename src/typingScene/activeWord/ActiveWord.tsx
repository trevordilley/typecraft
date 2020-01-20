import React from 'react'

const chars = (word: string) => word.split('').map(c => <span>{c}</span>)

const Word: React.FC<{word: string}> = ({word}) => {
    return (<>{chars(word)}</>)
}


export const ActiveWord: React.FC <{targetWord: string, currentWord: string}> =
    ({targetWord, currentWord}) => {

    // TODO: Don't use fixed height
    return (
        <div style={{height: 30}}>
            <div style={{position: 'absolute',  color: '#ddd'}}>
                <Word word={targetWord}/>
            </div>
            <div style={{position: 'absolute'}}>
                <Word word={currentWord}/>
            </div>
        </div>
    )

}