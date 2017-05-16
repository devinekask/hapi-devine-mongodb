module.exports = schema => {

  const arr = [];

  Object.keys(schema).map(k => {
    const obj = schema[k];
    obj.key = k;
    if (obj.upload) {
      arr.push(obj);
    }
  });

  return arr.length > 0 ? arr : false;

};
