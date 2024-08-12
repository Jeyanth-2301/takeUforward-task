FROM node:22.6.0-slim
WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8081
CMD ["node", "server.js"]