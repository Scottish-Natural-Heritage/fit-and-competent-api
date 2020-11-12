import dbConfig from '../config/database.js';
import Sequelize from 'sequelize';

import Application from './application.js';

const sequelize = new Sequelize(dbConfig.database);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Application = Application(sequelize, Sequelize);

export {db as default};
