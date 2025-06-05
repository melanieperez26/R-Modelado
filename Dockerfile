FROM node:18

WORKDIR /app

COPY . .

RUN npm install --include=dev

# Genera Prisma usando la ruta correcta
RUN npx prisma generate --schema=memoria_backend/prisma/schema.prisma

# Si usas TypeScript o quieres compilar
# RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
