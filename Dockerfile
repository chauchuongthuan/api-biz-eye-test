FROM node:18.16

# Set working directory
WORKDIR /app

COPY . .

# Install app dependencies
COPY package*.json ./
# COPY yarn*.lock ./

# Install node_modules
RUN yarn install --only=production

# Install PM2 globally
#RUN yarn global add pm2
RUN  yarn build
# Copy existing application directory contents
# COPY . .

COPY ./deployment/.env.dev ./.env

# RUN yarn build

EXPOSE 80
# CMD [ "yarn", "run", "start:prod" ]

# Run pm2 is not neccesary, only need if you run multiple node app in 1 docker
CMD [ "yarn", "start:prod" ]