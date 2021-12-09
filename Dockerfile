FROM node:16

WORKDIR /app

COPY . .

WORKDIR /app/vue_prac

RUN npm install
RUN npm run build
RUN mv ./dist/* ../mysql_express/public

WORKDIR /app/mysql_express

RUN npm install

RUN apt-get update && apt-get install -y wget

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

EXPOSE 3000

CMD [ "node", "app.js" ]