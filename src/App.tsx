import React from "react"
import {store} from "./Store"
import {observer} from "mobx-react-lite"
import * as Phaser from "phaser"
import {Game} from "./Game"

let radius = 10
let mousePos: Phaser.GameObjects.Text
const update = (scene: Phaser.Scene) => {
    mousePos.x = scene.input.x
    mousePos.y = scene.input.y
    mousePos.text = `${scene.input.x}, ${scene.input.y}`
}
const create = (scene: Phaser.Scene) => {
    const button = scene.add.text(100, 100, "Down (Click me!)", {fill: "#0f0"})
    button.setInteractive()
    button.on("pointerup", () => store.count -= 1)
    mousePos = scene.add.text(0, 0, "0,0", {fill: "#00f"})
    const circle = new Phaser.Geom.Circle(400, 300, 100)
    // @ts-ignore
    const graphics = scene.add.graphics({fillStyle: {color: 0xff0000}})
    graphics.fillCircleShape(circle)

    circle.diameter = circle.radius

    graphics.fillStyle(0x00ff00)
    graphics.fillCircleShape(circle)

    circle.radius = radius
    graphics.fillStyle(0x0000ff)
    graphics.fillCircleShape(circle)
}

const config: Phaser.Types.Core.GameConfig = {
    title: "Hello Game",
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: {
        create: function () {
            create(this as Phaser.Scene)
        },
        update: function () {
            update(this as Phaser.Scene)
        }
    }
}

const App = () => {
    return (
        <div>
            <Game
                config={config}
            >
                <Gui/>
            </Game>
        </div>
    )
}

const Gui = observer(() => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <button onClick={() => store.count += 1 }>
                Up
            </button>
            <div style={{color: "white"}}>{store.count}</div>
        </div>)
})

export default App
