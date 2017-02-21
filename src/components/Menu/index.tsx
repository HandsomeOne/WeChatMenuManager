import * as React from 'react'
import $ from './index.css'

interface MenuProps {
  buttons: Button[]
  setPath: (path: number[]) => void
  setButtons: (buttons: Button[]) => void
  setMode: (mode: 'add' | 'update') => void
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
                    this.props.setMode('update')
                    this.props.setPath([i, j])
                  }}
                >{button.name}</li>
              ))}
              {group.sub_button.length < 5 && (
                <li
                  onClick={() => {
                    this.props.setMode('add')
                    this.props.setPath([i, group.sub_button.length])
                  }}
                >+</li>
              )}
            </ul>
            <div
              onClick={() => {
                this.props.setMode('update')
                this.props.setPath([i])
              }}
            >
              <b>{group.name}</b>
            </div>
          </li>
        ))}
        {this.props.buttons.length < 3 && (
          <li
            onClick={() => {
              this.props.setMode('add')
              this.props.setPath([this.props.buttons.length])
            }}
          ><b>+</b></li>
        )}
      </ul>
    )
  }
}

export default Menu
