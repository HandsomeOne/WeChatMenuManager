declare const $: Record<string, string>

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
