FROM node:20
RUN apt-get update && apt-get install -y default-mysql-client
ENV NODE_ENV=development
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 6464
CMD ["npm", "run", "start"]