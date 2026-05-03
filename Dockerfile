# Use the official lightweight Node.js image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose the port Cloud Run uses
EXPOSE 8080

# Set environment variable for Cloud Run
ENV PORT=8080
ENV NODE_ENV=production

# Run as non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Start the server
CMD ["node", "server.js"]
