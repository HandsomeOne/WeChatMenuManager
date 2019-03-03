import React, { useRef } from 'react'
import './index.scss'
import Modal from '../Modal'

interface P {
  path: number[]
  buttons: Button[]
  mode: 'add' | 'update'
  setState: any
}

export default (props: P) => {
  const nameInput = useRef<HTMLInputElement>(null)
  const urlInput = useRef<HTMLInputElement>(null)

  function remove() {
    const { buttons, path } = props
    const [i, j] = path

    let newButtons: Button[] = []
    if (path.length === 1) {
      newButtons = buttons.filter((_, _i) => _i !== i)
    } else if (path.length === 2) {
      newButtons = buttons.slice()
      newButtons[i].sub_button = newButtons[i].sub_button.filter(
        (_, _j) => _j !== j,
      )
    }

    props.setState({
      buttons: newButtons,
      path: [],
    })
  }

  function confirmRemove() {
    const { buttons, path } = props
    const [i, j] = path
    const name =
      path.length === 1 ? buttons[i].name : buttons[i].sub_button[j].name

    Modal.confirm({
      type: 'warning',
      title: `确认删除“${name}”？`,
      body: '此操作不可撤销！',
      onConfirm: remove,
    })
  }

  function update(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (props.mode === 'add') {
      return add()
    }

    if (!e.currentTarget.checkValidity()) {
      return
    }

    const { buttons, path } = props
    const [i, j] = path

    let newButtons = buttons.slice()
    if (path.length === 1) {
      newButtons[i].name = nameInput.current!.value
    } else if (path.length === 2) {
      const subButton = newButtons[i].sub_button[j]
      subButton.name = nameInput.current!.value
      subButton.url = urlInput.current!.value
    }

    props.setState({
      buttons: newButtons,
      path: [],
    })
  }

  function add() {
    if (!nameInput.current!.value) {
      return
    }

    const { buttons, path } = props
    const [i, j] = path

    let newButtons = buttons.slice()
    if (path.length === 1) {
      newButtons.splice(i, 0, {
        name: nameInput.current!.value,
        sub_button: [],
      })
    } else if (path.length === 2) {
      newButtons[i].sub_button.splice(j, 0, {
        type: 'view',
        name: nameInput.current!.value,
        url: urlInput.current!.value,
        sub_button: [],
      })
    }

    props.setState({
      buttons: newButtons,
      path: [],
    })
  }

  const { buttons, path, mode } = props
  const [i, j] = path

  const addMode = mode === 'add'
  const actions = (
    <div>
      {addMode || (
        <button type="button" onClick={confirmRemove} className={$.del}>
          删除
        </button>
      )}
      <button type="submit" className={addMode ? $.add : $.save}>
        {addMode ? '新增' : '保存'}
      </button>
    </div>
  )
  switch (path.length) {
    case 1:
      return (
        <form className={$.editor} onSubmit={update}>
          <label htmlFor="name">名称</label>
          <input
            name="name"
            ref={nameInput}
            required
            defaultValue={addMode ? '' : buttons[i].name}
          />
          {actions}
        </form>
      )
    case 2:
      return (
        <form className={$.editor} onSubmit={update}>
          <label htmlFor="name">名称</label>
          <input
            name="name"
            ref={nameInput}
            required
            defaultValue={addMode ? '' : buttons[i].sub_button[j].name}
          />
          <label htmlFor="url">URL</label>
          <input
            type="url"
            name="url"
            ref={urlInput}
            required
            defaultValue={addMode ? '' : buttons[i].sub_button[j].url}
          />
          {actions}
        </form>
      )
    default:
      return <p className={$.default}>请在左侧面板中选择一个菜单项。</p>
  }
}
