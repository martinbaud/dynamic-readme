FROM node:22-slim
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Copy public assets to dist
RUN cp -r public dist/

# Expose port
EXPOSE 80

CMD ["npm", "run", "start:prod"]
