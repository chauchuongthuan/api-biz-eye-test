FROM node:16.19
#FROM node:18.16

# Set working directory
WORKDIR /app

COPY . .

# COPY yarn*.lock ./
RUN rm -rf pnpm-lock.yaml
RUN npm install pnpm -g

RUN pnpm install

# Install PM2 globally
#RUN yarn global add pm2
RUN  pnpm build
# Copy existing application directory contents
# COPY . .

COPY ./deployment/.env.dev ./.env

# RUN yarn build

EXPOSE 80
# CMD [ "yarn", "run", "start:prod" ]

# Run pm2 is not neccesary, only need if you run multiple node app in 1 docker
CMD [ "pnpm", "start:prod" ]