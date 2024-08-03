FROM node
WORKDIR /app

COPY package.json .

RUN npm install -f

COPY . .

RUN npm run build 

# Build the app
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Set the startup command
CMD serve -s build -l 8080

# Expose port 8080
EXPOSE 8080