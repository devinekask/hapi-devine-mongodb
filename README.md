# hapi-devine-mongodb

## Description

🔧 This Hapi plugin loads all schemas in the given directory and registers them as models with Mongoose.

**index.js and files starting with a _ are ignored**

## Install hapi-devine-mongodb

```bash
yarn add hapi-devine-mongodb
```

## Usage

register this module as a plugin in Hapi

```js

server.register({

  register: require(`hapi-devine-mongodb`),

  options: {
    connectionString: 'mongodb://localhost/test' // mongodb connection string (required)
    path: path.join(__dirname, `schemas`) // schema directory (required)
    log: true // provide logs (optional, default: true)
  }

}, pluginHandler);

```

## Schema Example

files in the schema directory should look like this

```js

const Schema = require(`mongoose`).Schema;

const Scopes = require(`../const/Scopes`);

const schema = new Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  }

});

module.exports = {schema}; // optional props collectionName & name (model name)

```

`hapi-devine-mongodb` defaults to the **name of the file** as the **model name**, Mongoose defaults to **modelname (lowercase) + 's'** for the **collection name**.

optional properties
- name <String>: the name of the model
- collectionName <String>: the name of the collection (ex. Feedback, there is no 'feedbacks', provide 'feedback')

example:
- filename: 'Tweet.js'
- model name: 'Tweet'
- collection name: 'tweets'

## License

MIT
