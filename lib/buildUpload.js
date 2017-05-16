const Joi = require(`joi`);
const {omit} = require(`lodash`);

const parseName = ({name = false, key}) => {
  if (!name) return n => `${key}_${n}`;
  return name;
};

module.exports = ({file, upload}) => {

  const isObj = typeof upload === `object`;

  let obj = {};
  const key = isObj ? upload.key : upload;

  const {key: fileKey} = file;
  let {name: rName} = file;

  rName = rName ? rName : false;

  if (isObj) {

    const {name} = upload;

    if (!upload.validation) upload.validation = Joi.string();
    if (!upload.type) upload.type = String;

    obj = Object.assign(
      {},
      omit(upload, [`name`, `key`]),
      omit(file, [`upload`]),
      {
        upload: true,
        fileKey,
        key,
        rName,
        name: parseName({name, key})
      }
    );


  } else {

    obj = Object.assign(
      {},
      omit(file, [`upload`, `key`]),
      {
        name: parseName({key}),
        upload: true,
        type: String,
        rName: rName ? rName : false,
        validation: Joi.string(),
        key,
        fileKey
      }
    );


  }

  return {obj, key};

};
