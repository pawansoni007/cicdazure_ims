FROM node
WORKDIR /app

COPY package.json .

RUN npm install -f

COPY . .

RUN npm run build 

CMD ["npm", "start"]