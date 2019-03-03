import React, { useState } from 'react'
import './App.scss'
import { Modal, Nav, Settings, Menu, Editor, Footer } from './components'
import { hasNonNullableProp } from './utils'

interface LegacyAppState {
  buttons: Button[]
  path: number[]
  mode: 'add' | 'update'
  getURL: string
  createURL: string
  isSettingsVisible: boolean
  isBusy: boolean
  u: undefined
  n: null
  s: string | undefined
}

export default () => {
  const [buttons, setButtons] = useState<Button[]>([])
  const [path, setPath] = useState<number[]>([])
  const [mode, setMode] = useState<'add' | 'update'>('update')
  const [isSettingsVisible, setIsSettingsVisible] = useState(true)
  const [isBusy, setIsBusy] = useState(false)
  const [getURL, setGetURL] = useState(() => {
    const hash = location.hash.slice(1)
    let getURL = ''
    let createURL = ''
    try {
      ;[getURL, createURL] = JSON.parse(atob(hash))
    } catch (e) {}
    return getURL
  })
  const [createURL, setCreateURL] = useState(() => {
    const hash = location.hash.slice(1)
    let getURL = ''
    let createURL = ''
    try {
      ;[getURL, createURL] = JSON.parse(atob(hash))
    } catch (e) {}
    return createURL
  })

  function setState(patch: Partial<LegacyAppState>) {
    if (hasNonNullableProp(patch, 'buttons')) {
      setButtons(patch.buttons)
    }
    if (hasNonNullableProp(patch, 'createURL')) {
      setCreateURL(patch.createURL)
    }
    if (hasNonNullableProp(patch, 'getURL')) {
      setGetURL(patch.getURL)
    }
    if (hasNonNullableProp(patch, 'isBusy')) {
      setIsBusy(patch.isBusy)
    }
    if (hasNonNullableProp(patch, 'isSettingsVisible')) {
      setIsSettingsVisible(patch.isSettingsVisible)
    }
    if (hasNonNullableProp(patch, 'mode')) {
      setMode(patch.mode)
    }
    if (hasNonNullableProp(patch, 'path')) {
      setPath(patch.path)
    }
  }

  function save() {
    setState({ isBusy: true })

    fetch(createURL, {
      method: 'POST',
      body: JSON.stringify({ button: buttons }),
    })
      .then(res => res.text())
      .then(body => {
        setState({ isBusy: false })
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
        setState({ isBusy: false })
        Modal.confirm({
          type: 'error',
          title: '可能是接口异常...',
          body: `详情为 ${e.toString()}，请打开网络面板查看。`,
        })
      })
  }

  function confirmSave() {
    if (!createURL) {
      return setState({
        isSettingsVisible: true,
      })
    }

    Modal.confirm({
      type: 'info',
      title: '请确认检查无误...',
      body: (
        <div>
          将提交
          <pre>{JSON.stringify({ button: buttons })}</pre>至{' '}
          <code>{createURL}</code>
        </div>
      ),
      onConfirm: save,
    })
  }

  return (
    <div>
      <Nav isSettingsVisible={isSettingsVisible} setState={setState} />

      <Settings
        getURL={getURL}
        createURL={createURL}
        isVisible={!getURL || isSettingsVisible}
        setState={setState}
      />

      <div className={$.container}>
        <div className={$.phone}>
          <Menu buttons={buttons} setState={setState} />
        </div>
        <div className={$.panel}>
          <Editor
            key={mode + path}
            buttons={buttons}
            path={path}
            mode={mode}
            setState={setState}
          />
        </div>
      </div>

      <button className={$.save} onClick={confirmSave} disabled={isBusy}>
        {createURL
          ? isBusy
            ? '提交中，请稍等...'
            : '保存所有更改并提交'
          : '请先填写用来创建菜单的 URL'}
      </button>

      <Footer />
    </div>
  )
}
