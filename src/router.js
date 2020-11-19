import express from 'express';
import config from './config/app.js';

const router = express.Router();

import Application from './controllers/application.js';

// `/health` is a simple health-check end-point to test whether the service is up.
router.get('/health', async (request, response) => {
  response.status(200).send({message: 'OK'});
});

// Allow an API consumer to allocate a new application number.
router.post('/applications', async (request, response) => {
  const baseUrl = new URL(
    `${request.protocol}://${request.hostname}:${config.port}${request.originalUrl}${
      request.originalUrl.endsWith('/') ? '' : '/'
    }`
  );

  try {
    const newId = await Application.create();
    response.status(201).location(new URL(newId, baseUrl)).send();
  } catch (error) {
    response.status(500).send({error});
  }
});

/**
 * Process a string in to either it's integer `number` representation or return
 * `undefined`.
 *
 * @param {string | undefined} dirtyValue The user's supplied integer value.
 * @returns {number | undefined} The cleaned integer value.
 */
const cleanInt = (dirtyValue) => {
  // Check we've not been given `undefined`.
  if (dirtyValue === undefined) {
    return undefined;
  }

  // Check we've not been given an empty string.
  const trimmedValue = dirtyValue.trim();
  if (trimmedValue === '') {
    return undefined;
  }

  // Check we're only receiving digits, not text, negative numbers or floats.
  if (!/^\d+$/.test(trimmedValue)) {
    return undefined;
  }

  // Check it does actually parse correctly.
  const valueAsNumber = Number.parseInt(trimmedValue, 10);
  if (Number.isNaN(valueAsNumber)) {
    return undefined;
  }

  // Return the fully validated integer value.
  return valueAsNumber.valueOf();
};

/**
 * Clean a user supplied 'day' in to either a `number` or `undefined`.
 *
 * @param {string | undefined} day The user's supplied day value.
 * @returns {number | undefined} The cleaned day value.
 */
const cleanDay = (day) => {
  if (day === undefined) {
    return undefined;
  }

  if (day < 1) {
    return undefined;
  }

  if (day > 31) {
    return undefined;
  }

  return day;
};

/**
 * Clean a user supplied 'month' in to either a `number` or `undefined`.
 *
 * @param {string | undefined} month The user's supplied month value.
 * @returns {number | undefined} The cleaned month value.
 */
const cleanMonth = (month) => {
  if (month === undefined) {
    return undefined;
  }

  if (month < 1) {
    return undefined;
  }

  if (month > 12) {
    return undefined;
  }

  return month;
};

/**
 * Clean a user supplied 'year' in to either a `number` or `undefined`.
 *
 * @param {string | undefined} year The user's supplied year value.
 * @returns {number | undefined} The cleaned year value.
 */
const cleanYear = (year) => {
  if (year === undefined) {
    return undefined;
  }

  if (year < 1000) {
    return undefined;
  }

  if (year > 9999) {
    return undefined;
  }

  return year;
};
export {router as default};
