FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine
# Node runs the assistant API next to nginx (server/, started by docker-start.sh).
RUN apk add --no-cache nodejs
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY server /opt/assistant
COPY docker-start.sh /docker-start.sh
EXPOSE 80
CMD ["sh", "/docker-start.sh"]
