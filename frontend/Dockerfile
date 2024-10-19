FROM node:22-alpine3.19

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .


EXPOSE 3000

CMD ["npm","run", "dev"]
