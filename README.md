This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Reactified Phaser
This project aims to be a template for a Phaser game leveraging React for it's GUI and
MobX for it's state management.

There is a simple `<Game>` component which takes a Phaser config object. The `children`
of this component will be the games GUI. They render relative to `(0,0)` of the game
canvas, and match the canvas coordinate system for screen space.

This allows you to leverage Phaser for the game logic and rendering, and leverage
react for the GUI elements.

The bridge between Phaser and React is MobX, a state management library which greatly simplifies managing state in
react apps and can be similarly leveraged as a place to consolidate state for the
Phaser portion of the app as well.

This template includes a minimal Phaser "game" that renders some circles, has
a text element showing the position of the mouse, a React button which increments
an integer (rendered from React) and an interactive bit of text rendered from Phaser.
Clicking the React button and the Phaser text changes the value of the counter to
demonstrate how the two systems can interact by simply sourcing from the same Store
(where we keep state).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
