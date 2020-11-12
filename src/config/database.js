const config = require('./app');

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    preMigrations: {
      username: 'licensing',
      password: config.licensingPassword,
      database: 'licensing',
      host: config.databaseHost,
      dialect: 'postgres',
      schema: 'public',
      logging: false
    },
    database: {
      username: 'fc',
      password: config.fcPassword,
      database: 'licensing',
      host: config.databaseHost,
      dialect: 'postgres',
      schema: 'fc',
      logging: false
    }
  };
} else {
  module.exports = {
    preMigrations: {
      dialect: 'sqlite',
      storage: './.development.db'
    },
    database: {
      dialect: 'sqlite',
      storage: './.development.db'
    }
  };
}
