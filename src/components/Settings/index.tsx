import React from 'react'
import './index.scss'
import { assertTypeIsButtons } from '../../utils'

interface Props {
  getURL: string
  createURL: string
  isVisible: boolean
  setState: any
}

class Settings extends React.PureComponent<Props, {}> {
  getURLInput!: HTMLInputElement
  createURLInput!: HTMLInputElement

  state = {
    error: '',
    errorId: 0,
    isBusy: false,
  }

  finish = (buttons?: Button[]) => {
    location.hash = btoa(
      JSON.stringify([this.getURLInput.value, this.createURLInput.value]),
    )
    this.setState({
      error: '',
      isBusy: false,
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
    this.setState({ isBusy: true })

    fetch(this.getURLInput.value)
      .then(res => res.json())
      .then(json => {
        assertTypeIsButtons(json)
        this.finish(json.menu.button)
      })
      .catch((e: Error) => {
        this.setState({
          errorId: this.state.errorId + 1,
          error: e.toString(),
          isBusy: false,
        })
      })
  }

  submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!this.getURLInput.value) {
      return
    }

    if (!e.currentTarget.checkValidity()) {
      return
    }

    if (this.state.error || this.getURLInput.value !== this.props.getURL) {
      this.check()
    } else {
      this.finish()
    }
  }

  componentDidMount() {
    if (this.getURLInput.value) {
      this.check()
    }
  }

  render() {
    return (
      <div
        className={$.settings}
        style={{ display: this.props.isVisible ? 'block' : 'none' }}
      >
        <form className={$.main} onSubmit={this.submit}>
          <label htmlFor="getURL">用来获取菜单的 URL</label>
          <input
            name="getURL"
            type="url"
            required
            defaultValue={this.props.getURL}
            ref={e => {
              this.getURLInput = e!
            }}
          />
          <label htmlFor="createURL">
            用来创建菜单的 URL
            <small>(可稍后填写)</small>
          </label>
          <input
            name="createURL"
            type="url"
            defaultValue={this.props.createURL}
            ref={e => {
              this.createURLInput = e!
            }}
          />
          <button type="submit" disabled={this.state.isBusy}>
            {this.state.isBusy ? '请求中...' : '保存'}
          </button>
          <p className={$.error} key={this.state.errorId}>
            {this.state.error}
          </p>
        </form>
      </div>
    )
  }
}

export default Settings
