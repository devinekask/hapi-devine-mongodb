const getUploads = require(`./getUploads`);

const Joi = require(`joi`);
const Schema = require(`mongoose`).Schema;

module.exports = schema => {

  const ul = getUploads(schema);

  if (ul) {

    ul.forEach(({uploads, key, required, name: rName}) => {

      delete schema[key];

      uploads.forEach(u => {
        schema[u.key] = Object.assign({}, u, {required}, {rName});
      });

    });

  }

  schema.isActive = {
    type: Boolean,
    default: true,
    validation: Joi.boolean()
  };

  const s = new Schema(schema, {
    timestamps: {
      createdAt: `created`,
      updatedAt: `modified`
    }
  });

  return s;

};
