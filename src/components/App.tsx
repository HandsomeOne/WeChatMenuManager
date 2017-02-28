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
    } catch (e) { }

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
        >保存所有更改并提交</button>

        <button
          className={$.showsettings}
          onClick={() => this.setState({ isSettingsVisible: true })}
        >
          <svg viewBox="0 0 100 100">
            <path d="M87.687 45.077c-.313-2.433-.816-4.807-1.542-7.079l8.145-11.73-5.827-7.515-.094-.123-5.824-7.514-12.955 5.577c-2.041-1.265-4.192-2.362-6.459-3.219L59.42 0H40.586l-3.709 13.474c-2.27.857-4.421 1.955-6.463 3.222l-12.957-5.577-5.825 7.514-.097.124-5.822 7.517 8.146 11.731a39.832 39.832 0 0 0-1.544 7.079L0 52.032l2.08 9.375.033.15 2.08 9.375 14.001.761a39.157 39.157 0 0 0 4.4 5.668l-2.396 14.227 8.416 4.173.138.067L37.169 100l9.309-10.796c1.161.109 2.335.173 3.524.173s2.358-.074 3.52-.184l9.317 10.804 8.415-4.173.141-.066 8.413-4.172-2.396-14.228a39.06 39.06 0 0 0 4.4-5.672l14-.759 2.078-9.375.035-.154L100 52.025l-12.313-6.948zM50.003 34.51c8.435 0 15.272 7.035 15.272 15.719 0 8.679-6.839 15.717-15.272 15.717-8.436 0-15.272-7.038-15.272-15.717 0-8.684 6.838-15.719 15.272-15.719z" />
          </svg>
        </button>

        <Settings
          visible={!this.state.getURL || this.state.isSettingsVisible}
          setState={this.delegateState<'buttons' | 'getURL' | 'createURL' | 'isSettingsVisible'>()}
        />
      </div>
    )
  }
}

export default App
