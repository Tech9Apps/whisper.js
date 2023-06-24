# Use the official Node.js 18 base image for Ubuntu
FROM node:18

# Update the system and install necessary dependencies
RUN apt-get update \
    && apt-get install -y build-essential cmake libsdl2-dev ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the project files
COPY . .

# Copy the package.json and yarn.lock files
COPY package.json .
COPY yarn.lock .

# Install dependencies using Yarn
RUN yarn install

# Build and compile the Whisper project
RUN cd whisper.cpp && make default
RUN cd whisper.cpp && npx cmake-js compile -T whisper-addon -B Release