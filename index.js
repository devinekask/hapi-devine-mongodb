const path = require(`path`);

const glob = require(`glob`);
const chalk = require(`chalk`);

const fs = require(`fs`);

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
          plugins = []
        } = file;

        const schema = buildSchema(file.schema);

        const pwd = Object.keys(schema.obj).map(k => schema.obj[k].password).includes(true);
        if (pwd) schema.plugin(require(`mongoose-bcrypt`));

        plugins.forEach(p => schema.plugin(p));


        const model = mongoose.model(modelName, schema, collectionName);
        const {collectionName: cn} = model.collection;

        if (log) {
          console.log(
          `${chalk.yellow(`hapi-devine-mongodb`)}: registered schema ${chalk.cyan(`'${modelName}'`)}, collection: ${chalk.cyan(`'${cn}'`)}`
          );
        }

      });

      if (log) console.log(``);

    }

  );

  next();

};

module.exports.register.attributes = {
  pkg: require(`./package.json`)
};
