FROM node:16.14
WORKDIR /usr/app

COPY ./ ./

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]