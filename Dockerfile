# Use nginx base image
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Copy your static HTML files to the web root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 85

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
