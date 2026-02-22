FROM nginx:1.27-alpine

# Copy static site files into nginx web root.
COPY . /usr/share/nginx/html

EXPOSE 80
