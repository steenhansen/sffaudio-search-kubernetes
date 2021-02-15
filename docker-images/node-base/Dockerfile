
# docker build -t steenhansen/sff-audio-kube:base-nodejs .    --no-cache

# docker push steenhansen/sff-audio-kube:base-nodejs

FROM node:15.5.1-alpine3.10                   

# Setup Pacific Timezone, bash for cp 
 RUN apk update && \
     apk add --no-cache tzdata && \
     apk add --update bash 

WORKDIR /bash-scripts
COPY /bash-scripts/*.sh ./

ARG the_time_zone="PST8PDT"
#ARG the_time_zone="EST"
#ARG the_time_zone="UTC"

RUN sh "set-time-zone.sh" "$the_time_zone"      

WORKDIR /nodejs-base
COPY /nodejs-base/package*.json ./

## if execute 'do_modclean' also then image size 134MB, else 142MB
RUN npm ci && \
    npm run do_modclean  
    
COPY /nodejs-base/web-app/ /nodejs-base/web-app/          

CMD ["node", "/nodejs-base/web-app/node__webserver/const-boot-web-80.js"]
