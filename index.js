const path = require(`path`);

const glob = require(`glob`);
const chalk = require(`chalk`);

const mongoose = require(`mongoose`);
mongoose.Promise = global.Promise;

const Joi = require(`joi`);
const Schema = require(`mongoose`).Schema;

module.exports.register = (server, options, next) => {

  const {
    path: p,
    connectionString,
    log = true
  } = options;

  if (!connectionString || !p) {
    throw new Error(`'connectionString' and 'path' are required`);
  }

  mongoose.connect(connectionString);

  glob(

    path.join(p, `**/*.js`),
    {ignore: [`**/*/index.js`, `**/*/_*.js`]},

    (err, files) => {

      if (log) console.log(``);

      files.forEach(f => {

        const file = path.resolve(p, f);

        const {
          schema,
          collectionName,
          modelName = path.basename(f, `.js`),
          plugins = []
        } = require(file);

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

        plugins.forEach(p => s.plugin(p));

        const model = mongoose.model(modelName, s, collectionName);
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
