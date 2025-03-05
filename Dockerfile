
# Stage 1 - Build the React client 
FROM node:18-alpine AS Client-builder
WORKDIR /app/Client

COPY Client/package.json Client/package-lock.json ./
RUN npm install --frozen-lockfile

COPY Client ./
RUN npm run build

# Stage 2 - Run the Node.js server
FROM node:18-alpine
WORKDIR /app/Server

COPY Server/package.json Server/package-lock.json ./
RUN npm install --frozen-lockfile

COPY Server ./
COPY --from=Client-builder /app/Client/build /app/Client/build

EXPOSE 3001

CMD ["npm", "start"]
