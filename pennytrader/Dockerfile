FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

CMD ["sh","-c", "npm run build && npx serve -s build -l 3002"]