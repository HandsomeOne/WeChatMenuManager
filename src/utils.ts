export function assertTypeIsButtons(json: {
  menu: { button: Button[] }
}) {
  if (!('menu' in json)) {
    throw new Error('没有 menu 字段，请检查菜单的返回体')
  }
  if (!('button' in json.menu)) {
    throw new Error(`menu 中没有 button 字段，请检查菜单的返回体`)
  }
  if (!Array.isArray(json.menu.button)) {
    throw new Error(`menu.button 不是数组，请检查菜单的返回体`)
  }
}
