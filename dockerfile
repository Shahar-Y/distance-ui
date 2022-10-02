FROM node:14-alpine as BUILD
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.21.1-alpine
COPY --from=BUILD app/nginx.conf /etc/nginx/nginx.conf
COPY --from=BUILD app/dist/distance-ui /usr/share/nginx/html
# EXPOSE 4201
EXPOSE 80
