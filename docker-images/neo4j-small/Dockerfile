
# docker build -t steenhansen/sff-audio-kube:small-neo4j . --no-cache

# docker push steenhansen/sff-audio-kube:small-neo4j

# This database has only 1 author and 5 books.
# http://localhost:81/cron-new-db-version-81 will fully populate it

# WORKDIR /var/lib/neo4j/    is what neo4j expects
FROM neo4j:3.4.9                    
COPY neo4j-data-small /
# WORKDIR /var/lib/neo4j/    is what neo4j expects









