FROM node:18

WORKDIR /project/backend

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]