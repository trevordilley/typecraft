import React, {Component} from "react"
import * as Phaser from "phaser"
import * as lodash from 'lodash'
const hostElementId = "game"
interface GameProps {
 config: Phaser.Types.Core.GameConfig
}

export const Game: React.FC<GameProps> = (props) => {

    const {config, children} = props
    return (   <>
        <GameGui config={config}>
            {children}
        </GameGui>
        <GameContainer config={config}/>
    </>)
}

const GameGui: React.FC<GameProps> = (props) => {

    const {config, children} = props

    return (
        <div
            id={`${hostElementId}-gui-container`}
            style={{
                // Set origin (0,0) to match origin of
                // the game canvas
                position: "absolute",

                // So the gui respects the positioning
                // of the canvas
                width: config.width,
                height: config.height,

                // Allow click through this container
                // div
                pointerEvents: "none"
            }}
        >
            <div
                id={`${hostElementId}-gui`}
                style={{
                    // The actual GUI, don't allow click through
                    // (so Buttons and stuff actually capture the clicks)
                    pointerEvents: "auto",

                    border: "1px solid"
                }}>
                {children}
            </div>
        </div>
        )
}

export class GameContainer extends Component<GameProps> {

    // TODO: This should probably update if we change the
    // any part of the actual config.
    shouldComponentUpdate(nextProps:GameProps , nextState:{}) {
        return !lodash.isEqual(this.props, nextProps)
    }

    componentDidMount() {
        const {config} = this.props
        new Phaser.Game({...config, parent: hostElementId})
    }

    render() {

        // The games (the `children` prop) GUI will render
        // as the first child and the game Canvas will be
        // the second element.
        //
        // Using `position: "absolute"` will place the GUI
        // OVER the game canvas and match it's origin to
        // the game canvas' origin (0,0) which is the
        // top-left, with x increasing going right and
        // y increasing going down.
        return (
            <div id={hostElementId} >
            </div>
        )

    }
}

