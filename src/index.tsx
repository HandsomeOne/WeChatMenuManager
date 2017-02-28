import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './components/App'

const root = document.getElementById('root')
const render = () => {
  ReactDOM.render(<AppContainer><App /></AppContainer>, root)
}

render()
if (module.hot) {
  module.hot.accept("./components/App", render)
}
