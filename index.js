const path = require(`path`);

const glob = require(`glob`);
const chalk = require(`chalk`);

const fs = require(`fs`);

const validateAuthModel = require(`./lib/validateAuthModel`);

const mongoose = require(`mongoose`);
mongoose.Promise = global.Promise;

const buildSchema = require(`./lib/buildSchema`);

module.exports.register = (server, options, next) => {

  const {
    path: p,
    connectionString,
    log = true
  } = options;

  if (!connectionString || !p) {
    throw new Error(`'connectionString' and 'path' are required`);
  }

  if (!fs.existsSync(p)) return;

  mongoose.connect(connectionString);

  glob(

    path.join(p, `**/*.js`),
    {ignore: [`**/*/index.js`, `**/*/_*.js`]},

    (err, files) => {

      if (log) console.log(``);

      files.forEach(f => {

        const file = require(path.resolve(p, f));

        const {
          collectionName,
          modelName = path.basename(f, `.js`),
          plugins = [],
          auth = false
        } = file;

        if (auth && !validateAuthModel(file.schema)) {
          throw new Error(`[${modelName}] please provide scope / password / login fields`);
        }

        const schema = buildSchema(file.schema, plugins, auth);

        const model = mongoose.model(modelName, schema, collectionName);
        const {collectionName: cn} = model.collection;

        if (log) {
          console.log(
          `${chalk.yellow(`hapi-devine-mongodb`)}: registered schema ${chalk.cyan(`'${modelName}'`)}, collection: ${chalk.cyan(`'${cn}'`)}`
          );
        }

      });

      if (log) console.log(``);

      next();

    }

  );

};

module.exports.register.attributes = {
  pkg: require(`./package.json`)
};
