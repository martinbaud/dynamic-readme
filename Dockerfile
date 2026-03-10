FROM node:22-slim
WORKDIR /usr/src/app

# Install system dependencies for @napi-rs/canvas
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Copy public assets to dist
RUN cp -r public dist/

# Expose port
EXPOSE 80

CMD ["npm", "run", "start:prod"]
