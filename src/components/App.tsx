import * as React from 'react'
import $ from './App.css'

import Menu from './Menu'
import Editor from './Editor'
import Settings from './Settings'

interface AppState {
  buttons: Button[]
  path: number[]
  mode: 'add' | 'update'
  getURL: string
  createURL: string
}

class App extends React.PureComponent<{}, AppState> {
  constructor() {
    super()

    const hash = location.hash.slice(1)
    let getURL = ''
    let createURL = ''
    try {
      [getURL, createURL] = JSON.parse(atob(hash))
    } catch (e) {}

    this.state = {
      buttons: [],
      path: [],
      mode: 'update',
      getURL,
      createURL,
    }
    this.setPath = this.setPath.bind(this)
    this.setButtons = this.setButtons.bind(this)
    this.setMode = this.setMode.bind(this)
    this.setGetURL = this.setGetURL.bind(this)
    this.setCreateURL = this.setCreateURL.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    if (this.state.getURL && !this.state.buttons.length) {
      fetch(this.state.getURL)
      .then(res => res.json())
      .then((json) => {
        this.setState({
          buttons: json.menu.button,
        })
      })
    }
  }

  setPath(path: number[]) {
    this.setState({ path })
  }

  setButtons(buttons: Button[]) {
    this.setState({ buttons })
  }

  setMode(mode: 'add' | 'update') {
    this.setState({ mode })
  }

  setGetURL(getURL: string) {
    this.setState({ getURL })
  }

  setCreateURL(createURL: string) {
    this.setState({ createURL })
  }

  save() {
    const data = JSON.stringify({ button: this.state.buttons }, null, 2)
    console.log(data)
  }

  render() {
    return (
      <div>
        <div className={$.container}>
          <div className={$.phone}>
            <Menu
              buttons={this.state.buttons}
              setPath={this.setPath}
              setButtons={this.setButtons}
              setMode={this.setMode}
            />
          </div>
          <div className={$.panel}>
            <Editor
              buttons={this.state.buttons}
              path={this.state.path}
              mode={this.state.mode}
              setPath={this.setPath}
              setButtons={this.setButtons}
            />
          </div>
        </div>
        <button
          className={$.save}
          onClick={this.save}
        >保存</button>
        <Settings
          visible={!this.state.getURL}
          setButtons={this.setButtons}
          setGetURL={this.setGetURL}
          setCreateURL={this.setCreateURL}
        />
      </div>
    )
  }
}

export default App
