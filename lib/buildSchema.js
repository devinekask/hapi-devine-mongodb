const filterKeysBy = require(`./filterKeysBy`);
const getAuthFields = require(`./getAuthFields`);

const Joi = require(`joi`);
const Schema = require(`mongoose`).Schema;

const buildUpload = require(`../lib/buildUpload`);

module.exports = (schema, plugins, auth) => {

  const ul = filterKeysBy(schema, `upload`);

  schema.isActive = {
    type: Boolean,
    default: true,
    validation: Joi.boolean()
  };

  Object.keys(schema).forEach(k => {
    const obj = schema[k];
    obj.key = k;
  });

  if (ul.length > 0) {

    ul.forEach(file => {

      const {key} = file;
      let {upload: uls} = file;

      if (!Array.isArray(uls)) {
        uls = [uls];
      }

      uls.forEach(upload => {

        const {key, obj} = buildUpload({upload, file});
        schema[key] = obj;

      });

      delete schema[key];


    });

  }

  if (auth) {
    const {password} = getAuthFields(schema);
    password[0].bcrypt = true;
  }

  const s = new Schema(schema, {
    timestamps: {
      createdAt: `created`,
      updatedAt: `modified`
    }
  });

  if (auth) {
    s.plugin(require(`mongoose-bcrypt`));
  }

  plugins.forEach(p => s.plugin(p));

  return s;

};
