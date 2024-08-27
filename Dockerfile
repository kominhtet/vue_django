# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vue.js application
RUN npm run build

# Install the 'serve' package to serve the built application
RUN npm install -g serve

# Set the command to run the application
CMD ["serve", "-s", "dist"]

# Expose port 5000 to the outside world
EXPOSE 5000