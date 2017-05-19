const filterKeysBy = require(`./filterKeysBy`);

module.exports = schema => {

  const {scope, password, login} = schema;

  return {
    scope: scope ? [`scope`] : filterKeysBy(schema, `scope`, {keys: true}),
    password: password ? [`password`] : filterKeysBy(schema, `password`, {keys: true}),
    login: login ? [`login`] : filterKeysBy(schema, `login`, {keys: true})
  };

};
