FROM node:16-alpine

# drop back to the non-privileged user for run-time
WORKDIR /home/node
USER node

# tell node, et al to run in production mode
ENV NODE_ENV production

# copy in the package files so that we can install and build the project
# dependencies
COPY --chown=node:node package*.json ./

# install all the node modules required
RUN npm ci

# copy the code from the project
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./util ./util
COPY --chown=node:node .sequelizerc ./

# these variables are for overriding but keep them consistent between image and
# run
ENV FC_API_PORT 3009
ENV FC_API_PATH_PREFIX fit-and-competent-api

# these variables are for overriding and they only matter during run
ENV LICENSING_DB_HOST override_this_value
ENV LICENSING_DB_PASS override_this_value
ENV FC_DB_PASS override_this_value
ENV FC_NOTIFY_API_KEY override_this_value

# let docker know about our listening port
EXPOSE $FC_API_PORT

# run the default start script, which kicks off a few pre-start things too
CMD ["npm", "start"]
