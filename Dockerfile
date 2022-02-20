FROM node:16.14
WORKDIR /usr/app
COPY ./ ./
RUN npm install
CMD ["npm", "start"]