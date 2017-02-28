import * as React from 'react'
import $ from './index.css'
import { assertTypeIsButtons } from '../../utils'

interface SettingsProps {
  isVisible: boolean
  setState: (state: Partial<Pick<AppState, 'buttons' | 'getURL' | 'createURL' | 'isSettingsVisible'>>) => void
}

class Settings extends React.PureComponent<SettingsProps, {}> {
  getURL: HTMLInputElement
  createURL: HTMLInputElement

  check = (e: React.FormEvent<HTMLFormElement>) => {
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
        isSettingsVisible: false,
      })
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
        style={{ display: this.props.isVisible ? 'block' : 'none' }}
      >
        <form className={$.main} onSubmit={this.check}>
          <label htmlFor="getURL">用于获取菜单的 URL</label>
          <input
            name="getURL"
            type="url"
            required
            defaultValue={getURL}
            ref={(e) => { this.getURL = e }}
          />
          <label htmlFor="createURL">用于创建菜单的 URL
            <small>(可稍后填写)</small>
          </label>
          <input
            name="createURL"
            type="url"
            defaultValue={createURL}
            ref={(e) => { this.createURL = e }}
          />
          <button type="submit">确认</button>
        </form>
      </div>
    )
  }
}

export default Settings
