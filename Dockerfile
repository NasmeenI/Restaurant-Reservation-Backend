FROM node:20-slim

# Install PNPM
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 8081

# Start the application in production mode
CMD ["pnpm", "run", "start:prod"]