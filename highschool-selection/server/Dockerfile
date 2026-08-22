FROM node:22-alpine
WORKDIR /app
COPY highschool-selection ./highschool-selection
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
CMD ["node", "highschool-selection/server/index.js"]
