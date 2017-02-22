import * as React from 'react'
import $ from './index.css'
import { assertTypeIsButtons } from '../../utils'

interface SettingsProps {
  visible: boolean
  setState: (state: Pick<AppState, 'buttons' | 'getURL' | 'createURL'>) => void
  close: () => void
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
      this.props.setState({
        buttons: json.menu.button,
        getURL: this.getURL.value,
        createURL: this.createURL.value,
      })
      this.props.close()
    })
    .catch((e: Error) => {
      console.log(e)
    })
  }

  render() {
    const hash = location.hash.slice(1)
    let getURL = ''
    let createURL = ''
    try {
      [getURL, createURL] = JSON.parse(atob(hash))
    } catch (e) {}

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
              defaultValue={getURL}
              ref={(e) => { this.getURL = e }}
            />
          </label>
          <label>
            用于创建菜单的 URL (可稍后填写)
            <input
              type="url"
              defaultValue={createURL}
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
