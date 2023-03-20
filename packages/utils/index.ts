// @ts-ignore
export { default as group } from "array.prototype.group"

export function exclude<T, Key extends keyof T>(
  obj: T,
  keys: Key[]
): Omit<T, Key> {
  for (const key of keys) delete obj[key]
  return obj
}

export function hstr(d: Date) {
  return [
    `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`,
    `${d.getHours()}時`,
  ].join(" ")
}
