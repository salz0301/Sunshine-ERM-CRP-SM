# Etapa 1: compilar el frontend
FROM node:22-alpine3.22 AS frontend

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


# Etapa 2: instalar dependencias del backend
FROM node:22-alpine3.22 AS dependencias-backend

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./

RUN npm ci --omit=dev


# Etapa 3: imagen final
FROM node:22-alpine3.22

LABEL org.opencontainers.image.source="https://github.com/salz0301/Sunshine-ERM-CRP-SM"

# Herramientas cliente de PostgreSQL 16
RUN apk add --no-cache postgresql16-client

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

# Backend y dependencias
COPY backend ./backend
COPY --from=dependencias-backend /app/backend/node_modules ./backend/node_modules

# Esquema y migraciones
COPY database ./database

# Frontend compilado
COPY --from=frontend /app/dist ./dist

WORKDIR /app/backend

EXPOSE 3001

# Preparar la base y arrancar la API
CMD ["sh", "-c", "node scripts/init-db.js && exec node src/server.js"]