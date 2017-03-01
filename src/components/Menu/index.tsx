import * as React from 'react'
import $ from './index.css'

interface Props {
  buttons: Button[]
  setState: (state: Partial<Pick<AppState, 'mode' | 'path'>>) => void
}

class Menu extends React.PureComponent<Props, {}> {
  static highlight(e: Element) {
    const highlighted = document.querySelector(`.${$.highlight}`)
    if (highlighted) {
      highlighted.className = Array.from(highlighted.classList)
        .filter(cls => cls !== $.highlight)
        .join(' ')
    }
    e.className += ' ' + $.highlight
  }

  render () {
    return (
      <ul className={$.menu}>
        {this.props.buttons.map((group, i) => (
          <li>
            <ul className={$.subMenu}>
              {group.sub_button.map((button, j) => (
                <li
                  onClick={(e) => {
                    Menu.highlight(e.currentTarget)
                    this.props.setState({
                      mode: 'update',
                      path: [i, j],
                    })
                  }}
                >{button.name}</li>
              ))}
              {group.sub_button.length < 5 && (
                <li
                  className={$.add}
                  onClick={(e) => {
                    Menu.highlight(e.currentTarget)
                    this.props.setState({
                      mode: 'add',
                      path: [i, group.sub_button.length],
                    })
                  }}
                >+</li>
              )}
            </ul>
            <h5
              onClick={(e) => {
                Menu.highlight(e.currentTarget)
                this.props.setState({
                  mode: 'update',
                  path: [i],
                })
              }}
            >{group.name}</h5>
          </li>
        ))}
        {this.props.buttons.length < 3 && (
          <li
            className={$.add}
            onClick={(e) => {
              Menu.highlight(e.currentTarget)
              this.props.setState({
                mode: 'add',
                path: [this.props.buttons.length]
              })
            }}
          ><b>+</b></li>
        )}
      </ul>
    )
  }
}

export default Menu
