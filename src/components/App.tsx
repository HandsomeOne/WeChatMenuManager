import * as React from 'react'
import $ from './App.css'

import Nav from './Nav'
import Menu from './Menu'
import Editor from './Editor'
import Settings from './Settings'
import Footer from './Footer'
import Modal from './Modal'

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
      isSettingsVisible: true,
    }
    this.setState = this.setState.bind(this)
  }

  save = () => {
    if (!this.state.createURL) {
      return this.setState({
        isSettingsVisible: true,
      })
    }

    const data = { button: this.state.buttons }
    fetch(this.state.createURL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(res => res.text())
    .then(body => {
      try {
        const json = JSON.parse(body)
        if (json.errmsg === 'ok') {
          Modal.confirm({
            type: 'good',
            title: '提交成功',
            body: '请稍等片刻，等待菜单生效。'
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
          type: 'neutral',
          title: '未知的返回格式',
          body: <pre>{body}</pre>,
        })
      }
    }).catch((e: Error) => {
      Modal.confirm({
        type: 'error',
        title: '可能是接口异常...',
        body: `详情为 ${e.toString()}，请打开网络面板查看。`,
      })
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
            <Menu
              buttons={this.state.buttons}
              setState={this.setState}
            />
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
          onClick={this.save}
        >{
          this.state.createURL ?
          '保存所有更改并提交' :
          '请先填写用来创建菜单的 URL'
        }</button>

        <Footer />
      </div>
    )
  }
}

export default App
