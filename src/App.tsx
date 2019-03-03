import React from 'react'
import './App.scss'
import { Modal, Nav, Settings, Menu, Editor, Footer } from './components'

export default class extends React.PureComponent<{}, AppState> {
  constructor(props: {}) {
    super(props)

    const hash = location.hash.slice(1)
    let getURL = ''
    let createURL = ''
    try {
      ;[getURL, createURL] = JSON.parse(atob(hash))
    } catch (e) {}

    this.state = {
      buttons: [],
      path: [],
      mode: 'update',
      getURL,
      createURL,
      isSettingsVisible: true,
      isBusy: false,
    }
    this.setState = this.setState.bind(this)
  }

  save = () => {
    this.setState({ isBusy: true })

    fetch(this.state.createURL, {
      method: 'POST',
      body: JSON.stringify({ button: this.state.buttons }),
    })
      .then(res => res.text())
      .then(body => {
        this.setState({ isBusy: false })
        try {
          const json = JSON.parse(body)
          if (json.errmsg === 'ok') {
            Modal.confirm({
              type: 'good',
              title: '提交成功',
              body: '请稍等片刻，等待菜单生效。',
            })
          } else {
            Modal.confirm({
              type: 'error',
              title: '提交失败...',
              body: <pre>{body}</pre>,
            })
          }
        } catch (e) {
          Modal.confirm({
            title: '未知的返回格式',
            body: <pre>{body}</pre>,
          })
        }
      })
      .catch((e: Error) => {
        this.setState({ isBusy: false })
        Modal.confirm({
          type: 'error',
          title: '可能是接口异常...',
          body: `详情为 ${e.toString()}，请打开网络面板查看。`,
        })
      })
  }

  confirmSave = () => {
    if (!this.state.createURL) {
      return this.setState({
        isSettingsVisible: true,
      })
    }

    Modal.confirm({
      type: 'info',
      title: '请确认检查无误...',
      body: (
        <div>
          将提交
          <pre>{JSON.stringify({ button: this.state.buttons })}</pre>至{' '}
          <code>{this.state.createURL}</code>
        </div>
      ),
      onConfirm: this.save,
    })
  }

  render() {
    return (
      <div>
        <Nav
          isSettingsVisible={this.state.isSettingsVisible}
          setState={this.setState}
        />

        <Settings
          getURL={this.state.getURL}
          createURL={this.state.createURL}
          isVisible={!this.state.getURL || this.state.isSettingsVisible}
          setState={this.setState}
        />

        <div className={$.container}>
          <div className={$.phone}>
            <Menu buttons={this.state.buttons} setState={this.setState} />
          </div>
          <div className={$.panel}>
            <Editor
              key={this.state.mode + this.state.path}
              buttons={this.state.buttons}
              path={this.state.path}
              mode={this.state.mode}
              setState={this.setState}
            />
          </div>
        </div>

        <button
          className={$.save}
          onClick={this.confirmSave}
          disabled={this.state.isBusy}
        >
          {this.state.createURL
            ? this.state.isBusy
              ? '提交中，请稍等...'
              : '保存所有更改并提交'
            : '请先填写用来创建菜单的 URL'}
        </button>

        <Footer />
      </div>
    )
  }
}
