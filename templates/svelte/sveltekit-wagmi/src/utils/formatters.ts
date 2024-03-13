export const stringify: typeof JSON.stringify = (value, replacer, space) =>
  JSON.stringify(
    value,
    (key, value_) => {
      return typeof replacer === 'function' ? replacer(key, value_) : value_
    },
    space,
  )
