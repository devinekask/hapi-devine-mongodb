const getUploads = require(`./getUploads`);

const Joi = require(`joi`);
const Schema = require(`mongoose`).Schema;

const {omit} = require(`lodash`);

module.exports = schema => {

  const ul = getUploads(schema);

  if (ul) {

    ul.forEach(file => {

      const {uploads, key} = file;

      file.rName = file.name;
      delete file.name;

      delete schema[key];

      uploads.forEach(u => {

        schema[u.key] = Object.assign(
          {},
          u,
          omit(file, [`uploads`]),
          {upload: true}
        );

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
