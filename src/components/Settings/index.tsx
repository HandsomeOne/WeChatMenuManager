import * as React from 'react'
import $ from './index.css'

interface SettingsProps {
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

  check() {
    if (!(this.getURL.value && this.createURL.value)) {
      return
    }

    fetch(this.getURL.value)
    .then(res => res.json()
      .then(json => {
        if (!('menu' in json && 'button' in json.menu)) {
          throw new Error(`数据格式不正确`)
        }
        location.hash = btoa(JSON.stringify([
          this.getURL.value,
          this.createURL.value,
        ]))
        this.props.setButtons(json)
        this.props.setGetURL(this.getURL.value)
        this.props.setCreateURL(this.createURL.value)
      })
    )
    .catch((e: Error) => {
      console.log(e)
    })
  }

  render() {
    return (
      <div className={$.settings}>
        <label>
          用于获取菜单的 URL
          <input
            type="url"
            required
            ref={(e) => { this.getURL = e }}
          />
        </label>
        <label>
          用于创建菜单的 URL
          <input
            type="url"
            required
            ref={(e) => { this.createURL = e }}
          />
        </label>
        <button onClick={this.check}>确认</button>
      </div>
    )
  }
}

export default Settings
