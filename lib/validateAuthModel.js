const getAuthFields = require(`./getAuthFields`);

module.exports = schema => {

  const {scope, password, login} = getAuthFields(schema);

  if (scope.length === 1 && password.length === 1 && login.length > 0) return true;
  return false;

};
