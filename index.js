const path = require(`path`);

const glob = require(`glob`);

const mongoose = require(`mongoose`);
mongoose.Promise = global.Promise;

module.exports.register = (server, options, next) => {

  const {
    schemasDir,
    mongoUrl
  } = options;

  if (!mongoUrl || !schemasDir) {
    throw new Error(`'mongoUrl' and 'schemasDir' required`);
  }

  mongoose.connect(mongoUrl);

  glob(

    path.join(schemasDir, `**/*.js`),
    {ignore: [`**/*/index.js`, `**/*/_*.js`]},

    (err, files) => files.forEach(f => {

      const file = path.resolve(schemasDir, f);
      const {schema, collectionName, modelName = path.basename(f, `.js`)} = require(file);

      const model = mongoose.model(modelName, schema, collectionName);
      const {collectionName: cn} = model.collection;

      console.log(`mongoose: registered schema '${modelName}', collection: '${cn}'`);

    })

  );

  next();

};

module.exports.register.attributes = {
  name: `hapi-devine-mongoose`,
  version: `0.1.0`
};
