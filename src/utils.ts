export function assertTypeIsButtons(json: {
  menu: { button: Button[] }
}) {
  if (!('menu' in json)) {
    throw new Error('没有 menu 字段')
  }
  if (!('button' in json.menu)) {
    throw new Error(`menu 中没有 button 字段`)
  }
  if (!Array.isArray(json.menu.button)) {
    throw new Error(`menu.button 不是数组`)
  }
}
