FROM gcr.io/primaku-web/primaku-cdic-base:latest as build
RUN mkdir -p /app/.nuxt
WORKDIR /app

COPY . .

#RUN yarn run build --verbose
#RUN yarn start

RUN ls -la /app/.nuxt
RUN yarn build:stg

EXPOSE 5512

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=5512

CMD [ "npm", "start" ]
