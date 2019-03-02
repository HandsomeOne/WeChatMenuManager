import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

Object.defineProperty(window, '$', {
  value: new Proxy({}, { get: (_, name) => name }),
})

ReactDOM.render(<App />, document.getElementById('root'))
