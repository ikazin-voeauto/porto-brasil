
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Set environment
ENV NODE_ENV=production

EXPOSE 3000

# Start application
CMD ["node", "src/index.js"]
