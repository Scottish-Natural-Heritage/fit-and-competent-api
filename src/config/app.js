// Grab our config from the env vars, or set some defaults if they're missing.
module.exports = Object.freeze({
  port: process.env.FC_API_PORT || 3005,
  databaseHost: process.env.LICENSING_DB_HOST || 'override_this_value',
  licensingPassword: process.env.LICENSING_DB_PASS || 'override_this_value',
  pathPrefix: process.env.FC_API_PATH_PREFIX ? `/${process.env.FC_API_PATH_PREFIX}` : '/fit-and-competent-api',
  notifyApiKey: process.env.FC_NOTIFY_API_KEY
});
