import * as React from 'react'
import $ from './index.css'

interface MenuProps {
  buttons: Button[]
  setState: (state: Pick<AppState, 'mode' | 'path'>) => void
}

class Menu extends React.PureComponent<MenuProps, {}> {
  render () {
    return (
      <ul className={$.menu}>
        {this.props.buttons.map((group, i) => (
          <li>
            <ul className={$.subMenu}>
              {group.sub_button.map((button, j) => (
                <li
                  onClick={() => {
                    this.props.setState({
                      mode: 'update',
                      path: [i, j],
                    })
                  }}
                >{button.name}</li>
              ))}
              {group.sub_button.length < 5 && (
                <li
                  onClick={() => {
                    this.props.setState({
                      mode: 'add',
                      path: [i, group.sub_button.length],
                    })
                  }}
                >+</li>
              )}
            </ul>
            <div
              onClick={() => {
                this.props.setState({
                  mode: 'update',
                  path: [i],
                })
              }}
            >
              <b>{group.name}</b>
            </div>
          </li>
        ))}
        {this.props.buttons.length < 3 && (
          <li
            onClick={() => {
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
