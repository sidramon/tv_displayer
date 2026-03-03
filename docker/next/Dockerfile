# BASE SECTION
FROM node:18-alpine

# WORKDIR SECTION
WORKDIR /app

# DEPENDENCIES SECTION
COPY package*.json ./
RUN npm install

# RUN SECTION
EXPOSE 3000
CMD ["npm", "run", "dev"]