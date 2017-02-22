import * as React from 'react'
import $ from './index.css'
import { assertTypeIsButtons } from '../../utils'

interface SettingsProps {
  visible: boolean
  setButtons: (buttons: Button[]) => void
  setGetURL: (getURL: string) => void
  setCreateURL: (createURL: string) => void
}

interface SettingsState {

}

class Settings extends React.PureComponent<SettingsProps, SettingsState> {
  getURL: HTMLInputElement
  createURL: HTMLInputElement

  constructor() {
    super()
    this.check = this.check.bind(this)
  }

  check(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!this.getURL.value) {
      return
    }

    if(!e.currentTarget.checkValidity()) {
      return
    }

    fetch(this.getURL.value)
    .then(res => res.json())
    .then(json => {
      assertTypeIsButtons(json)

      location.hash = btoa(JSON.stringify([
        this.getURL.value,
        this.createURL.value,
      ]))
      this.props.setButtons(json.menu.button)
      this.props.setGetURL(this.getURL.value)
      this.props.setCreateURL(this.createURL.value)
    })
    .catch((e: Error) => {
      console.log(e)
    })
  }

  render() {
    return (
      <div
        className={$.settings}
        style={{ display: this.props.visible ? 'block' : 'none' }}
      >
        <form className={$.main} onSubmit={this.check}>
          <label>
            用于获取菜单的 URL
            <input
              type="url"
              required
              ref={(e) => { this.getURL = e }}
            />
          </label>
          <label>
            用于创建菜单的 URL (可稍后填写)
            <input
              type="url"
              ref={(e) => { this.createURL = e }}
            />
          </label>
          <button type="submit">确认</button>
        </form>
      </div>
    )
  }
}

export default Settings
