FROM node:20-alpine

WORKDIR /app

# install deps first (better caching)
COPY package*.json ./
RUN npm install

# copy source
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/main.js"]
