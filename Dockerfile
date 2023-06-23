FROM node:18

RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y cmake
RUN apt-get install -y libsdl2-dev
RUN apt-get install -y ffmpeg

WORKDIR /app

COPY . .

COPY package.json .
COPY yarn.lock .
RUN yarn install

RUN cd whisper.cpp
RUN cd whisper.cpp && make
RUN cd whisper.cpp npx cmake-js compile -T whisper-addon -B Release

# docker build --platform=linux/arm64 .