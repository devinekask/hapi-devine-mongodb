const getUploads = require(`./getUploads`);

const Joi = require(`joi`);
const Schema = require(`mongoose`).Schema;

const buildUpload = require(`../lib/buildUpload`);

module.exports = schema => {

  const ul = getUploads(schema);

  Object.keys(schema).forEach(k => {
    const obj = schema[k];
    if (obj.password) {
      obj.bcrypt = true;
    }
  });

  if (ul) {

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

  schema.isActive = {
    type: Boolean,
    default: true,
    validation: Joi.boolean(),
    key: `isActive`
  };

  const s = new Schema(schema, {
    timestamps: {
      createdAt: `created`,
      updatedAt: `modified`
    }
  });


  return s;

};
