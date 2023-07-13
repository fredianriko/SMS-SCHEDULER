# Use the official Node.js v14 image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project directory to the container
COPY . .

# Expose the port on which your application listens
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
