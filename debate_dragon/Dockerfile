FROM node:16.15 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY ./src ./src
COPY ./media ./media
COPY ./tsconfig.json ./
COPY ./config.json ./

RUN npm run build # produce /build

FROM node:16.15-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build ./app/build ./

CMD npm run run

