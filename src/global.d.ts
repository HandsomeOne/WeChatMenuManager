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

declare module '*.css' {
  const content: {
    [key: string]: string
  }
  export default content
}
