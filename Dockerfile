FROM node:carbon

HEALTHCHECK CMD curl -fs http://localhost:$PORT/xAPI/about || exit 1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
