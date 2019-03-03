export default <T, U extends keyof T & string>(
  target: T,
  name: U,
): target is T & { [key in U]: NonNullable<T[U]> } =>
  Object.prototype.hasOwnProperty.call(target, name) &&
  target[name] !== undefined &&
  target[name] !== null
