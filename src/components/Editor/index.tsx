import * as React from 'react'
import $ from './index.css'

interface Props {
  path: number[]
  buttons: Button[]
  mode: 'add' | 'update'
  setState: (state: Partial<Pick<AppState, 'path' | 'buttons'>>) => void
}

class Editor extends React.PureComponent<Props, {}> {
  name: HTMLInputElement
  url: HTMLInputElement

  remove = () => {
    const { buttons, path } = this.props
    const [i, j] = path

    let newButtons: Button[] = []
    if (path.length === 1) {
      newButtons = buttons.filter((_, _i) => _i !== i)
    } else if (path.length === 2) {
      newButtons = buttons.slice()
      newButtons[i].sub_button = newButtons[i].sub_button.filter((_, _j) => _j !== j)
    }

    this.props.setState({
      buttons: newButtons,
      path: [],
    })
  }

  update = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (this.props.mode === 'add') {
      return this.add()
    }

    if (!e.currentTarget.checkValidity()) {
      return
    }

    const { buttons, path } = this.props
    const [i, j] = path

    let newButtons = buttons.slice()
    if (path.length === 1) {
      newButtons[i].name = this.name.value
    } else if (path.length === 2) {
      const subButton = newButtons[i].sub_button[j]
      subButton.name = this.name.value
      subButton.url = this.url.value
    }

    this.props.setState({
      buttons: newButtons,
      path: [],
    })
  }

  add = () => {
    if (!this.name.value) {
      return
    }

    const { buttons, path } = this.props
    const [i, j] = path

    let newButtons = buttons.slice()
    if (path.length === 1) {
      newButtons.splice(i, 0, {
        name: this.name.value,
        sub_button: [],
      })
    } else if (path.length === 2) {
      newButtons[i].sub_button.splice(j, 0, {
        type: 'view',
        name: this.name.value,
        url: this.url.value,
        sub_button: [],
      })
    }

    this.props.setState({
      buttons: newButtons,
      path: [],
    })
  }

  render() {
    const { buttons, path, mode } = this.props
    const [i, j] = path

    const addMode = mode === 'add'
    const actions = (
      <div>
        {addMode || <button
          onClick={this.remove}
          className={$.del}
        >删除</button>}
        <button
          type="submit"
          className={addMode ? $.add : $.save}
        >
          {addMode ? '新增' : '保存'}
        </button>
      </div>
    )
    switch (path.length) {
      case 1:
        return (
          <form className={$.editor} onSubmit={this.update}>
            <label htmlFor="name">名称</label>
            <input
              name="name"
              key={mode + path.join(',')}
              ref={(e) => { this.name = e }}
              required
              defaultValue={addMode ? '' : buttons[i].name}
            />
            {actions}
          </form>
        )
      case 2:
        return (
          <form className={$.editor} onSubmit={this.update}>
            <label htmlFor="name">名称</label>
            <input
              name="name"
              key={mode + path.join(',')}
              ref={(e) => { this.name = e }}
              required
              defaultValue={addMode ? '' : buttons[i].sub_button[j].name}
            />
            <label htmlFor="url">URL</label>
            <input
              type="url"
              name="url"
              key={mode + path.join(',') + 'url'}
              ref={(e) => { this.url = e }}
              required
              defaultValue={addMode ? '' : buttons[i].sub_button[j].url}
            />
            {actions}
          </form>
        )
      default: return null
    }
  }
}

export default Editor
