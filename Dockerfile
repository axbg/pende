FROM node:14
EXPOSE 8080

# Prepare env
RUN apt update && apt install -y gdb

# Build front-end
WORKDIR /usr/pende/front
COPY ./front ./
RUN npm install && npm run prod

# Build back-end
WORKDIR /usr/pende/back
COPY ./back/ ./
RUN npm install
RUN mkdir -p dist && mv ../front/dist/* dist && rm -rf ../front

# Run
ENTRYPOINT ["npm", "start"]