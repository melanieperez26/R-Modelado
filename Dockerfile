# Usa la imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del backend al contenedor
COPY memoria_backend/package*.json ./
COPY memoria_backend/prisma ./prisma/
COPY memoria_backend/server.js ./

# Instala las dependencias
RUN npm install

# Genera los archivos de Prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 8080

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]
