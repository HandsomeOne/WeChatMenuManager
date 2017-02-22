interface Button {
  name: string
  sub_button: SubButton[]
}

interface SubButton {
  type: string
  name: string
  url: string
  sub_button: SubButton[]
}

interface AppState {
  buttons: Button[]
  path: number[]
  mode: 'add' | 'update'
  getURL: string
  createURL: string
  isSettingsVisible: boolean
}

declare module '*.css' {
  const content: {
    [key: string]: string
  }
  export default content
}
