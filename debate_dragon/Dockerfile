FROM node:16.15.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --verbose

COPY ./src ./src
# COPY ./media ./media
COPY ./tsconfig.json ./
COPY ./config.json ./

RUN npm run build # produce /build

FROM node:16.15.0-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --verbose

COPY --from=build ./app/build ./build
COPY ./config.json ./
COPY ./media/ ./media/

CMD npm run run
