import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

const root = document.createElement('div')
document.body.appendChild(root)

interface P {
  type?: 'warning' | 'error' | 'good' | 'info'
  title: React.ReactNode
  body: React.ReactNode
  onConfirm?: () => void
}

export default function Modal(props: P) {
  const [isVisible, setIsVisible] = useState(true)

  function close() {
    setIsVisible(false)
  }

  return isVisible ? (
    <div className={$.mask} onClick={close}>
      <div
        className={[$.modal, $[props.type || '']].join(' ')}
        onClick={e => e.stopPropagation()}
      >
        <h1>{props.title}</h1>
        <p>{props.body}</p>
        <div className={$.buttons}>
          <button
            onClickCapture={close}
            onClick={props.onConfirm}
            className={$.confirm}
          >
            确定
          </button>
          {props.onConfirm && <button onClick={close}>取消</button>}
        </div>
      </div>
    </div>
  ) : null
}

Modal.key = 0
Modal.confirm = (props: P) => {
  ReactDOM.render(<Modal {...props} key={Modal.key++} />, root)
}
