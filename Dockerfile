FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Environment variables
ENV DB_URL cluster0.w1qpo3t.mongodb.net
ENV DB_USERNAME raghu
ENV DB_PASSWORD oX1cegHONfsBsisp
ENV NODEPORT 3000
ENV SECRET ilovescotchyscotch
ENV NODE_ENV Developmemt

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]