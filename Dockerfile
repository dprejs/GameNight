FROM node:21 AS deps

WORKDIR /app
COPY ./ /

RUN npm install

EXPOSE 3000

RUN npm run build
CMD npm run start