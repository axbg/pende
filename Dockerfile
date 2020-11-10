FROM node:14

WORKDIR /usr/pende

COPY ./back/package*.json ./

RUN npm install

COPY ./back/ ./

RUN apt update

RUN apt install -y gdb

CMD ["npm", "start"]

EXPOSE 8080