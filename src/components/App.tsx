import * as React from 'react'
import $ from './App.css'

import Menu from './Menu'
import Editor from './Editor'
import Settings from './Settings'

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
      isSettingsVisible: false,
    }
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

  delegateState<T extends keyof AppState>() {
    return (state: Pick<AppState, T>) => {
      this.setState(state)
    }
  }

  save() {
    const data = { button: this.state.buttons }
    fetch(this.state.createURL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(json => {
      alert(json.errmsg)
    })
  }

  render() {
    return (
      <div>
        <div className={$.container}>
          <div className={$.phone}>
            <Menu
              buttons={this.state.buttons}
              setState={this.delegateState<'mode' | 'path'>()}
            />
          </div>
          <div className={$.panel}>
            <Editor
              buttons={this.state.buttons}
              path={this.state.path}
              mode={this.state.mode}
              setState={this.delegateState<'path' | 'buttons'>()}
            />
          </div>
        </div>
        <button
          className={$.save}
          onClick={this.save}
        >保存</button>

        <div className={$.urls}>
          <p>用于获取菜单的 URL {this.state.getURL}</p>
          <p>用于创建菜单的 URL {this.state.createURL}</p>
          <button onClick={() => this.setState({ isSettingsVisible: true })}>更改</button>
        </div>

        <Settings
          visible={!this.state.getURL || this.state.isSettingsVisible}
          setState={this.delegateState<'buttons' | 'getURL' | 'createURL' | 'isSettingsVisible'>()}
        />
      </div>
    )
  }
}

export default App
