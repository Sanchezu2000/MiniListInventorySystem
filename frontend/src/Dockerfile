# Dockerfile is an instruction where you configure the commmand to run your projects in Docker
# Like an instruction for Docker on what should it run to make the project work
 
# Always put your base image or the core tool of your project in this part
FROM node:22
 
# Enter the app directory (Like cd in the terminal)
WORKDIR /app
 
# Copies ppackage.json and package-lock.json(if available)
COPY package*.json ./
 
# Install app dependencies
RUN npm install
 
# Copies the rest of the app into the container
COPY . .
 
EXPOSE 5173
 
CMD [ "npm", "run", "dev", "--", "--host"]
 
 
 
#Run this to build
#docker build -t my-frontend-app .
#docker run -p 5173:5173 my-frontend-app