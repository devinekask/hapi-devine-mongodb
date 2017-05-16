const Joi = require(`joi`);
const {omit} = require(`lodash`);

module.exports = ({file, upload}) => {

  const isObj = typeof upload === `object`;

  let obj = {};
  const key = isObj ? upload.key : upload;

  const {key: fileKey} = file;
  const {name: rName = false} = file;

  if (isObj) {

    const {name = false} = upload;

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
        name
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
        rName,
        validation: Joi.string(),
        key,
        fileKey
      }
    );


  }

  return {obj, key};

};
