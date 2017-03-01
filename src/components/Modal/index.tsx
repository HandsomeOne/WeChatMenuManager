import * as React from 'react'
import * as ReactDOM from 'react-dom'
import $ from './index.css'

const root = document.createElement('div')
document.body.appendChild(root)

interface Props {
  type: 'warning' | 'error' | 'good' | 'neutral'
  title: React.ReactNode
  body: React.ReactNode
  onConfirm?: () => void
}

class Modal extends React.PureComponent<Props, {}> {
  state = {
    isVisible: true,
  }

  close = () => {
    this.setState({
      isVisible: false,
    })
  }

  render() {
    return this.state.isVisible ? (
      <div className={$.mask} onClick={this.close}>
        <div
          className={[$.modal, $[this.props.type]].join(' ')}
          onClick={e => e.stopPropagation()}
        >
          <h1>{this.props.title}</h1>
          <p>{this.props.body}</p>
          <div className={$.buttons} >
            <button
              onClickCapture={this.close}
              onClick={this.props.onConfirm}
              className={$.confirm}
            >确定</button>
            {this.props.onConfirm && (
              <button onClick={this.close}>取消</button>
            )}
          </div>
        </div>
      </div>
    ) : null
  }

  static key = 0
  static confirm(props: Props) {
    ReactDOM.render((
      <Modal
        {...props}
        key={Modal.key++}
      />
    ), root)
  }
}

export default Modal
