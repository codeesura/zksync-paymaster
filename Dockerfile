# Use the official Node.js image as base
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies based on the lockfile
RUN yarn install --frozen-lockfile

# Copy the rest of the application files to the working directory
COPY . .

# Compile the code
RUN yarn compile

# Set the command to run the application
CMD [ "yarn", "execute" ]