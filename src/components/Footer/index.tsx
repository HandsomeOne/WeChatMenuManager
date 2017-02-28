import * as React from 'react'
import $ from './index.css'

class Footer extends React.PureComponent<{}, {}> {
  render() {
    return (
      <footer className={$.footer}>
        <span>
          <a href="https://github.com/HandsomeOne/WeChatMenuManager" target="_blank">Fork me on GitHub</a>
        </span>
        <span>©2017 <a href="https://HandsomeOne.github.io/" target="_blank">HandsomeOne</a></span>
      </footer>
    )
  }
}

export default Footer
