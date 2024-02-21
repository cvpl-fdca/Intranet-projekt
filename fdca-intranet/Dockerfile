# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the contents of the fdca-intranet folder to the working directory
COPY . /app

# Install dependencies
RUN npm install

# Build the app using SvelteKit
RUN npm run build

# Expose the port on which the app will be served
EXPOSE 3000

# Start the app with Node.js
CMD ["node", "build"]
