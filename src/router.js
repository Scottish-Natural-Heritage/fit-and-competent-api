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

export {router as default};
