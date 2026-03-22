# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies for tsc)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled javascript from builder
COPY --from=builder /app/dist ./dist

# Create a data directory with proper permissions for audit logs
RUN mkdir -p /app/data && chown node:node /app/data

# Switch to non-root user
USER node

# Define default environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]
