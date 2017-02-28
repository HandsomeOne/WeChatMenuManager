import * as React from 'react'
import $ from './index.css'
import { assertTypeIsButtons } from '../../utils'

interface SettingsProps {
  getURL: string
  createURL: string
  isVisible: boolean
  setState: (state: Partial<Pick<AppState, 'buttons' | 'getURL' | 'createURL' | 'isSettingsVisible'>>) => void
}

class Settings extends React.PureComponent<SettingsProps, {}> {
  getURLInput: HTMLInputElement
  createURLInput: HTMLInputElement

  check = () => {
    fetch(this.getURLInput.value)
    .then(res => res.json())
    .then(json => {
      assertTypeIsButtons(json)

      location.hash = btoa(JSON.stringify([
        this.getURLInput.value,
        this.createURLInput.value,
      ]))
      this.props.setState({
        buttons: json.menu.button,
        getURL: this.getURLInput.value,
        createURL: this.createURLInput.value,
        isSettingsVisible: false,
      })
    })
    .catch((e: Error) => {
      console.log(e)
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
      location.hash = btoa(JSON.stringify([
        this.getURLInput.value,
        this.createURLInput.value,
      ]))
      this.props.setState({
        getURL: this.getURLInput.value,
        createURL: this.createURLInput.value,
        isSettingsVisible: false,
      })
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
        </form>
      </div>
    )
  }
}

export default Settings
