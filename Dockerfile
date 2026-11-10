FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
# The Go service the UI calls. Override at run time, e.g. http://api:8080.
ENV API_UPSTREAM=http://api:8080
# Only substitute API_UPSTREAM, so nginx's own $uri/$host variables survive.
ENV NGINX_ENVSUBST_FILTER=^API_UPSTREAM$
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/nginx-health >/dev/null || exit 1
