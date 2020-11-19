// eslint-disable-next-line unicorn/import-index, import/no-useless-path-segments
import db from '../models/index.js';
import Sequelize from 'sequelize';

const {Application} = db;

/**
 * Attempt to create an empty, randomly allocated application.
 *
 * Generates a random number and attempts to create an empty record in the
 * database with that ID. If it fails because another record already exists,
 * then it returns undefined. If any errors occur, it bubbles them back to the
 * calling code.
 *
 * @returns {Sequelize.Model | undefined} A new empty model is successful,
 * otherwise undefined.
 */
const tryCreate = async () => {
  try {
    // Generate a random 5 digit number and attempt to create a new record with
    // that ID.
    const newApp = await Application.create({id: Math.floor(Math.random() * 99999)});

    // X.create only ever returns if it's successful, so we can just return our
    // new model.
    return newApp;
  } catch (error) {
    // There are two possible error conditions here...

    // The first is if we try to create a duplicate ID, which we manually check
    // for and return undefined as an indicator.
    if (error instanceof Sequelize.UniqueConstraintError) {
      return undefined;
    }

    // The second error condition is 'anything else' i.e. a proper DB error. In
    // that case, just throw it up to the calling code.
    throw error;
  }
};

/**
 * An object to perform 'persistence' operations on our application objects.
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
const ApplicationController = {
  /**
   * Create a new randomly allocated application.
   *
   * Takes up to 10 attempts to create a new empty application. If it fails, it throws
   *
   * @returns {Number} ID of the new application
   */
  create: async () => {
    let newApp;
    let remainingAttempts = 10;
    // Loop until we have a new empty application or we run out of attempts,
    // whichever happens first.
    while (newApp === undefined && remainingAttempts > 0) {
      newApp = await tryCreate(); // eslint-disable-line no-await-in-loop
      remainingAttempts--;
    }

    // If we run out of attempts let the calling code know by raising an error.
    if (newApp === undefined) {
      throw new Error('Unable to generate new application number.');
    }

    // On success, return the new application's ID.
    return newApp.id;
  },

  /**
   * Retrieve the specified registration from the database.
   *
   * @param {Number} id an existing registration's ID
   * @returns an existing registration
   */
  findOne: async (id) => {
    return Application.findByPk(id);
  },

  /**
   * Replace a application in the database with our new JSON model.
   *
   * @param {Number} id an existing application's ID
   * @param {any} reg a JSON version of the model to replace the database's copy
   * @returns {boolean} true if the record is updated, otherwise false
   */
  update: async (id, app) => {
    // Save the new values to the database.
    const result = await Application.update(app, {where: {id}});

    // Check to make sure the saving process went OK.
    const success = result.length > 0 && result[0] === 1;
    if (success) {
      // Take a copy of the object's fields as we're about to add two extra ones
      // to it.
      // eslint-disable-next-line unicorn/prevent-abbreviations
      const updatedApplication = {...app};

      // Generate and save the human-readable version of the application no.
      updatedApplication.applicationRef = `FC-${String(id).padStart(5, '0')}`;

      // Return the updated object to the caller, for them to send back to the
      // client.
      return updatedApplication;
    }

    // If something went wrong, return undefined to signify this.
    return undefined;
  }
};

export {ApplicationController as default};
