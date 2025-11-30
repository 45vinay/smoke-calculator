# Use official NGINX image
FROM nginx:alpine

# Copy all project files into NGINX
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80