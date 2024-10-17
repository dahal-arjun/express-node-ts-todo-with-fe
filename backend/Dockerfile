FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json .

RUN npm install

COPY ./src .

EXPOSE 8000

# Start the application
CMD ["npm","run", "dev"]
