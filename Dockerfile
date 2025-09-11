FROM node:20-alpine AS deps

ARG NEXT_PUBLIC_BACKEND_URL

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-https://backend.niceforest-23188099.westeurope.azurecontainerapps.io}
ARG NEXT_PUBLIC_ALLOW_ANONYMOUS=true
ENV NEXT_PUBLIC_ALLOW_ANONYMOUS=$NEXT_PUBLIC_ALLOW_ANONYMOUS
RUN echo "NEXT_PUBLIC_BACKEND_URL is: $NEXT_PUBLIC_BACKEND_URL"

WORKDIR /app

COPY package.json yarn.lock ./

# Create .env file from build argument
RUN echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL" > .env && \
    echo "NEXT_PUBLIC_ALLOW_ANONYMOUS=$NEXT_PUBLIC_ALLOW_ANONYMOUS" >> .env

RUN yarn install --frozen-lockfile

FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_ALLOW_ANONYMOUS=true
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_ALLOW_ANONYMOUS=$NEXT_PUBLIC_ALLOW_ANONYMOUS

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create .env file from build argument
RUN echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL" > .env && \
    echo "NEXT_PUBLIC_ALLOW_ANONYMOUS=$NEXT_PUBLIC_ALLOW_ANONYMOUS" >> .env

RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_ALLOW_ANONYMOUS=true

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set permissions
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]