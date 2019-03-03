import React, { useEffect, useRef, useState } from 'react'
import './index.scss'
import { assertTypeIsButtons } from '../../utils/'

interface P {
  getURL: string
  createURL: string
  isVisible: boolean
  setState: any
}

export default (props: P) => {
  const getURLInput = useRef<HTMLInputElement>(null)
  const createURLInput = useRef<HTMLInputElement>(null)

  const [error, setError] = useState('')
  const [errorId, setErrorId] = useState(0)
  const [isBusy, setIsBusy] = useState(false)

  function finish(buttons?: Button[]) {
    location.hash = btoa(
      JSON.stringify([
        getURLInput.current!.value,
        createURLInput.current!.value,
      ]),
    )
    setError('')
    setIsBusy(false)

    const state = {
      getURL: getURLInput.current!.value,
      createURL: createURLInput.current!.value,
      isSettingsVisible: false,
      buttons: undefined as Button[] | undefined,
    }
    if (buttons) {
      state.buttons = buttons
    }
    props.setState(state)
  }

  function check() {
    setIsBusy(true)

    fetch(getURLInput.current!.value)
      .then(res => res.json())
      .then(json => {
        assertTypeIsButtons(json)
        finish(json.menu.button)
      })
      .catch((e: Error) => {
        setErrorId(errorId + 1)
        setError(e.toString())
        setIsBusy(false)
      })
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!getURLInput.current!.value) {
      return
    }

    if (!e.currentTarget.checkValidity()) {
      return
    }

    if (error || getURLInput.current!.value !== props.getURL) {
      check()
    } else {
      finish()
    }
  }

  useEffect(() => {
    if (getURLInput.current!.value) {
      check()
    }
  }, [])

  return (
    <div
      className={$.settings}
      style={{ display: props.isVisible ? 'block' : 'none' }}
    >
      <form className={$.main} onSubmit={submit}>
        <label htmlFor="getURL">用来获取菜单的 URL</label>
        <input
          name="getURL"
          type="url"
          required
          defaultValue={props.getURL}
          ref={getURLInput}
        />
        <label htmlFor="createURL">
          用来创建菜单的 URL
          <small>(可稍后填写)</small>
        </label>
        <input
          name="createURL"
          type="url"
          defaultValue={props.createURL}
          ref={createURLInput}
        />
        <button type="submit" disabled={isBusy}>
          {isBusy ? '请求中...' : '保存'}
        </button>
        <p className={$.error} key={errorId}>
          {error}
        </p>
      </form>
    </div>
  )
}
