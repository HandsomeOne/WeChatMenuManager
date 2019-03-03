import React from 'react'
import './index.scss'

interface P {
  buttons: Button[]
  setState: any
}

function highlight(e: Element) {
  const highlighted = document.querySelector(`.${$.highlight}`)
  if (highlighted) {
    highlighted.className = Array.from(highlighted.classList)
      .filter(cls => cls !== $.highlight)
      .join(' ')
  }
  e.className += ' ' + $.highlight
}

export default (props: P) => {
  return (
    <ul className={$.menu}>
      {props.buttons.map((group, i) => (
        <li>
          <ul className={$.subMenu}>
            {group.sub_button.map((button, j) => (
              <li
                onClick={e => {
                  highlight(e.currentTarget)
                  props.setState({
                    mode: 'update',
                    path: [i, j],
                  })
                }}
              >
                {button.name}
              </li>
            ))}
            {group.sub_button.length < 5 && (
              <li
                className={$.add}
                onClick={e => {
                  highlight(e.currentTarget)
                  props.setState({
                    mode: 'add',
                    path: [i, group.sub_button.length],
                  })
                }}
              >
                +
              </li>
            )}
          </ul>
          <h5
            onClick={e => {
              highlight(e.currentTarget)
              props.setState({
                mode: 'update',
                path: [i],
              })
            }}
          >
            {group.name}
          </h5>
        </li>
      ))}
      {props.buttons.length < 3 && (
        <li
          className={$.add}
          onClick={e => {
            highlight(e.currentTarget)
            props.setState({
              mode: 'add',
              path: [props.buttons.length],
            })
          }}
        >
          <b>+</b>
        </li>
      )}
    </ul>
  )
}
