#!/bin/bash

BASEDIR=$(dirname $0)
ADMINDIR="$(realpath $BASEDIR/..)"

echo "Shutdown Containers"
docker compose down

echo "Creating Database Volume"

# CREATE VOLUME IF NOT EXISTS
docker volume remove planter_data
docker volume create planter_data

# START CONTAINER IF NOT STARTED
docker compose up -d database 

# WAIT 15 SECONDS
sleep 15

# Optional dropdb
docker exec -i database dropdb --username=directus --if-exists directus

echo "directus DB dropped"

# RESTORE BACKUP
echo "Restoring dump"
gunzip < $ADMINDIR/data/postgres-backup.sql.gz | docker exec -i database psql --username directus --dbname=postgres
echo "Dump restored"

echo "Finished Database Volume"


echo "Creating Uploads Volume"
# UNTAR
mkdir -p $ADMINDIR/data/uploads
tar -xf $ADMINDIR/data/uploads_backup.tar -C $ADMINDIR/data/uploads

# CREATE VOLUME IF NOT EXISTS
docker volume remove planter_uploads
docker volume create planter_uploads

# Fire Up Helper Container
echo "Create helper box"
docker run -v planter_uploads:/directus/uploads --name helper --rm -itd busybox sh

# CLEAR OLD DATA
echo "Clear old data"
docker exec -it helper sh -c "rm -rf /directus/uploads/*"

# COPY DB DATA
echo "Copy uploads"
docker cp $ADMINDIR/data/uploads/. helper:/directus/uploads

# Recraft ownership to 1000:1000 which is node
echo "Fixing ownership"
docker exec -it helper sh -c "chown -R 1000:1000 /directus/uploads"

# REMOVE HELPER
echo "Stop helper container"
docker rm -f helper
echo "Finished Uploads Volume"

# CLEANUP
rm -rf ./data/uploads

#docker compose up -d 
echo "Containers restarted"
