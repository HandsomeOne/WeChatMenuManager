import React from 'react'
import './index.scss'

export default () => (
  <footer className={$.footer}>
    <span>
      ©2017{' '}
      <a href="https://HandsomeOne.github.io/" target="_blank">
        HandsomeOne
      </a>
    </span>
    <span className={$.badge}>
      <a
        href="https://github.com/HandsomeOne/WeChatMenuManager"
        target="_blank"
      >
        Fork me on GitHub
      </a>
    </span>
  </footer>
)
