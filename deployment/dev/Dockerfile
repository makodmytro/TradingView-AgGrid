# Use Nginx image from Docker Hub
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY build/ /usr/share/nginx/html

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Add our custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
