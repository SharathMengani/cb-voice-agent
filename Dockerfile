FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci
COPY design-references design-references
COPY apps/web apps/web
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_DEMO_MODE=true NODE_ENV=production
WORKDIR /app/apps/web
RUN npm run build
EXPOSE 3000
CMD ["npm","run","start"]
