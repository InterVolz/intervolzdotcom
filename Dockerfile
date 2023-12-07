# Use nginx image from Docker Hub as the base image
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static website files into the container
COPY src/ /usr/share/nginx/html/

# Expose both port 80 and 443
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
