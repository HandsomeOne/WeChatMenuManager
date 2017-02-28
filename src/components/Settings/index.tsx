import * as React from 'react'
import $ from './index.css'
import { assertTypeIsButtons } from '../../utils'

interface Props {
  getURL: string
  createURL: string
  isVisible: boolean
  setState: (state: Partial<AppState>) => void
}

interface State {
  error: string
  errorId: number
}

class Settings extends React.PureComponent<Props, State> {
  getURLInput: HTMLInputElement
  createURLInput: HTMLInputElement

  state = {
    error: '',
    errorId: 0,
  }

  finish = (buttons?: Button[]) => {
    location.hash = btoa(JSON.stringify([
      this.getURLInput.value,
      this.createURLInput.value,
    ]))
    this.setState({
      error: '',
    })
    const state: Partial<AppState> = {
      getURL: this.getURLInput.value,
      createURL: this.createURLInput.value,
      isSettingsVisible: false,
    }
    if (buttons) {
      state.buttons = buttons
    }
    this.props.setState(state)
  }

  check = () => {
    fetch(this.getURLInput.value)
    .then(res => res.json())
    .then(json => {
      assertTypeIsButtons(json)
      this.finish(json.menu.buttons)
    })
    .catch((e: Error) => {
      this.setState({
        errorId: this.state.errorId + 1,
        error: e.toString()
      })
    })
  }

  submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!this.getURLInput.value) {
      return
    }

    if(!e.currentTarget.checkValidity()) {
      return
    }

    if (this.getURLInput.value !== this.props.getURL) {
      this.check()
    } else {
      this.finish()
    }
  }

  render() {
    return (
      <div
        className={$.settings}
        style={{ display: this.props.isVisible ? 'block' : 'none' }}
      >
        <form className={$.main} onSubmit={this.submit}>
          <label htmlFor="getURL">用于获取菜单的 URL</label>
          <input
            name="getURL"
            type="url"
            required
            defaultValue={this.props.getURL}
            ref={(e) => { this.getURLInput = e }}
          />
          <label htmlFor="createURL">用于创建菜单的 URL
            <small>(可稍后填写)</small>
          </label>
          <input
            name="createURL"
            type="url"
            defaultValue={this.props.createURL}
            ref={(e) => { this.createURLInput = e }}
          />
          <button type="submit">确认</button>
          <p className={$.error} key={this.state.errorId}>{
            this.state.error
          }</p>
        </form>
      </div>
    )
  }
}

export default Settings
