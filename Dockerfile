FROM node:14

WORKDIR /usr/pende

COPY ./back/package*.json ./

RUN npm install

COPY ./back/ ./

CMD ["npm", "start"]

EXPOSE 8080