# Use Node.js to build the React app
FROM node:20 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files and build the React app
COPY . .
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine

# Copy the React build files to the Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]