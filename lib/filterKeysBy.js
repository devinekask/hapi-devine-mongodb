module.exports = (schema, filter, {keys = false} = {}) => {

  const arr = Object.keys(schema)
    .map(k => schema[k])
    .filter(o => o[filter]);

  if (keys) return arr.map(o => o.key);
  return arr;

};
