REM $ cd docker-images
REM $ docker-run.bat

REM This will kill old containers and then enables
REM http://localhost:7474/browser
REM http://localhost/\?author=philip-k-dick

REM http://localhost:81/cron-new-db-version-81          
REM     takes a few minutes to update the db
REM     watch db-browser for updates
REM     take 2 refreshes to clear caches

REM Docker Desktop will now have 3 containers

REM clear docker
    docker rm --force neo4j__container
    docker rm --force webserver__container
    docker rm --force cron__container
    docker network rm neo4j__nodejs

REM create network 
    docker network create neo4j__nodejs

REM create containers 
    docker run -d                                     ^
        --name=neo4j__container                       ^
        -p 7474:7474 -p 7687:7687                     ^
            --env-file=neo4j-docker-auth.env          ^
            --network=neo4j__nodejs                   ^
        steenhansen/sff-audio-kube:small-neo4j 

    docker run -d                                    ^
        --name=webserver__container                  ^
        -p 80:8080                                   ^
        -e OUTSIDE_HTML_PORT_80=80                   ^
        -e INSIDE_HTML_PORT_8080=8080                ^
            --env-file=neo4j-docker-auth.env         ^
            --network=neo4j__nodejs                  ^
            -e NEO4J_CONTAINER_NAME=neo4j__container ^
            -e NEO4J_BROWSER_7474=7474               ^
            -e BOLT_URI_7687=7687                    ^
        steenhansen/sff-audio-kube:base-nodejs  

    docker run -d                                      ^
        --name=cron__container                         ^
        -p 81:8181                                     ^
        -e CRON_NEW_DB_VERSION=/cron-new-db-version-81 ^
        -e INSIDE_CRON_PORT_8181=8181                  ^
            --env-file=neo4j-docker-auth.env           ^
            --network=neo4j__nodejs                    ^
            -e NEO4J_CONTAINER_NAME=neo4j__container   ^
            -e NEO4J_BROWSER_7474=7474                 ^
            -e BOLT_URI_7687=7687                      ^
        steenhansen/sff-audio-kube:update-nodejs  
