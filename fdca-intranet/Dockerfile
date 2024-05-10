# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app
# Define build-time variables for Azure credentials
ARG AZURE_CLIENT_ID
ARG AZURE_TENANT_ID
ARG AZURE_CLIENT_SECRET
ARG AZURE_SUBSCRIPTION_ID
ARG ENVIRONMENT
ARG ORIGIN

# Set the environment variables
ENV AZURE_CLIENT_ID=$AZURE_CLIENT_ID
ENV AZURE_TENANT_ID=$AZURE_TENANT_ID
ENV AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET
ENV AZURE_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
ENV ORIGIN=$ORIGIN


# Copy the contents of the fdca-intranet folder to the working directory
COPY . /app

# Install dependencies
RUN npm install

# Create .env file and set PUBLIC_ENVIRONMENT variable
RUN echo "PUBLIC_ENVIRONMENT=$ENVIRONMENT" > .env

# Build the app using SvelteKit
RUN npm run build


# Expose the port on which the app will be served
EXPOSE 3000

# Start the app with Node.js
CMD ["node", "build"]