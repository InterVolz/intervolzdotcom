# Use nginx image from Docker Hub as the base image
FROM nginx:alpine

# Copy static website files into the container
# COPY . /usr/share/nginx/html
COPY src/ /usr/share/nginx/html/


# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]