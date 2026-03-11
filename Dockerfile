# Use Alpine Linux with Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Copy build and config files
COPY .next ./.next
COPY .source ./.source
COPY next.config.ts ./
COPY tsconfig.json ./
COPY source.config.ts ./
COPY postcss.config.mjs ./
COPY components.json ./
COPY eslint.config.mjs ./

# Install dependencies
RUN npm ci --production

# Expose port (adjust if needed)
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
