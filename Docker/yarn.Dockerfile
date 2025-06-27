FROM node:20.13.1

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4 --activate

COPY . .

RUN yarn install --immutable

RUN yarn add -D @nestjs/cli

ARG TARGET_APP

RUN target=${TARGET_APP} yarn build

WORKDIR /app/typescript/apps/${TARGET_APP}

EXPOSE 3000

CMD ["yarn", "start"]
