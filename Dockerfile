# ---------- BASE ----------
FROM node:20-alpine

WORKDIR /app

# ---------- INSTALL DEPS ----------
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- COPY SOURCE ----------
COPY . .

# ---------- BUILD (OBLIGATOIRE POUR next start) ----------
RUN npm run build

# ---------- ENV ----------
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# ---------- START ----------
CMD ["npm", "run", "start"]