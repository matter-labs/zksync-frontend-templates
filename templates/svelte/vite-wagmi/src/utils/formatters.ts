export const stringify: typeof JSON.stringify = (value, replacer, space) => {
  return JSON.stringify(
    value,
    (key, value_) => {
      const value = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value) : value;
    },
    space
  );
};
