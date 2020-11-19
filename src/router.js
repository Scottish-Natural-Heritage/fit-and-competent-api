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

/**
 * Clean the incoming POST request body to make it more compatible with the
 * database and its validation rules.
 *
 * @param {any} body the incoming request's body
 * @returns {any} a json object that's just got our cleaned up fields on it
 */
const cleanInput = (body) => {
  const firearmDate = new Date(body.certificateIssuedDate);
  const firearmDay = cleanDay(firearmDate.getDate());
  const firearmMonth = cleanMonth(firearmDate.getMonth() + 1);
  const firearmYear = cleanYear(firearmDate.getFullYear());
  const firearmDateInvalid =
    firearmDate.getDate() !== firearmDay ||
    firearmDate.getMonth() + 1 !== firearmMonth ||
    firearmDate.getFullYear() !== firearmYear;

  const qualificationDate = new Date(body.qualificationObtainedDate);
  const qualificationDay = cleanDay(qualificationDate.getDate());
  const qualificationMonth = cleanMonth(firearmDate.getMonth() + 1);
  const qualificationYear = cleanYear(firearmDate.getFullYear());
  const qualificationDateInvalid =
    qualificationDate.getDate() !== qualificationDay ||
    qualificationDate.getMonth() + 1 !== qualificationMonth ||
    qualificationDate.getFullYear() !== qualificationYear;

  return {
    // The booleans are just copied across.
    convictions: body.convictions,
    bestPractice: body.bestPractice,
    // The Integers need to be checked that they just contain numbers and are positive
    certificateNumber: body.certificateNumber === undefined ? undefined : cleanInt(body.certificateNumber),
    redExperience: body.redExperience === undefined ? undefined : cleanInt(body.redExperience),
    redControl: body.redControl === undefined ? undefined : cleanInt(body.redControl),
    roeExperience: body.roeExperience === undefined ? undefined : cleanInt(body.roeExperience),
    roeControl: body.roeControl === undefined ? undefined : cleanInt(body.roeControl),
    sikaExperience: body.sikaExperience === undefined ? undefined : cleanInt(body.sikaExperience),
    sikaControl: body.sikaControl === undefined ? undefined : cleanInt(body.sikaControl),
    fallowExperience: body.fallowExperience === undefined ? undefined : cleanInt(body.fallowExperience),
    fallowControl: body.fallowControl === undefined ? undefined : cleanInt(body.fallowControl),
    // The dates
    certificateIssuedDate: firearmDateInvalid ? undefined : body.certificateIssuedDate,
    qualificationObtainedDate: qualificationDateInvalid ? undefined : body.qualificationObtainedDate,
    // The strings are trimmed for leading and trailing whitespace and then
    // copied across if they're in the POST body or are set to undefined if
    // they're missing.
    qualificationHeld: body.qualificationHeld === undefined ? undefined : body.qualificationHeld.trim(),
    qualificationReference: body.qualificationReference === undefined ? undefined : body.qualificationReference.trim(),
    fullName: body.fullName === undefined ? undefined : body.fullName.trim(),
    addressLine1: body.addressLine1 === undefined ? undefined : body.addressLine1.trim(),
    addressLine2: body.addressLine2 === undefined ? undefined : body.addressLine2.trim(),
    addressTown: body.addressTown === undefined ? undefined : body.addressTown.trim(),
    addressCounty: body.addressCounty === undefined ? undefined : body.addressCounty.trim(),
    addressPostcode: body.addressPostcode === undefined ? undefined : body.addressPostcode.trim(),
    phoneNumber: body.phoneNumber === undefined ? undefined : body.phoneNumber.trim(),
    emailAddress: body.emailAddress === undefined ? undefined : body.emailAddress.trim(),
    refereeName: body.refereeName === undefined ? undefined : body.refereeName.trim(),
    refereeEmail: body.refereeEmail === undefined ? undefined : body.refereeEmail.trim()
  };
};

// Allow an API consumer to save a applications against an allocated but un-assigned application number.
router.put('/applications/:id', async (request, response) => {
  try {
    // Try to parse the incoming ID to make sure it's really a number.
    const existingId = Number(request.params.id);
    if (isNaN(existingId)) {
      response.status(404).send({message: `Application ${request.params.id} not valid.`});
      return;
    }

    // Check if there's a application allocated at the specified ID.
    // eslint-disable-next-line unicorn/prevent-abbreviations
    const existingApplication = await Application.findOne(existingId);
    if (existingApplication === undefined || existingApplication === null) {
      response.status(404).send({message: `Application ${existingId} not allocated.`});
      return;
    }

    // Check the specified application hasn't been assigned to anyone yet.
    if (existingApplication.fullName !== undefined && existingApplication.fullName !== null) {
      response.status(409).send({message: `Application ${existingId} already assigned.`});
      return;
    }

    // Clean up the user's input before we store it in the database.
    const cleanObject = cleanInput(request.body);
    // Update the application in the database with our client's values.
    // eslint-disable-next-line unicorn/prevent-abbreviations
    const updatedApplication = await Application.update(existingId, cleanObject);

    // If they're not successful, send a 500 error.
    if (updatedApplication === undefined) {
      response.status(500).send({message: `Could not update application ${existingId}.`});
    }

    // If they are, send back the finalised application.
    response.status(200).send(updatedApplication);
  } catch (error) {
    // If anything goes wrong (such as a validation error), tell the client.
    response.status(500).send({error});
  }
});

export {router as default};
