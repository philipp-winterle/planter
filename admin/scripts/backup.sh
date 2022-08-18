#!/bin/bash

BASEDIR=$(dirname $0)
ADMINDIR="$(realpath $BASEDIR/..)"


echo "Exporting database from volume ..."

# Start database container if not started
docker compose up -d database 

sleep 10 
# --inserts: Dump data as INSERT commands (rather than COPY). This will make restoration very slow; it is mainly useful for making dumps that can be loaded into non-PostgreSQL databases. Any error during restoring will cause only rows that are part of the problematic INSERT to be lost, rather than the entire table contents. Note that the restore might fail altogether if you have rearranged column order. The --column-inserts option is safe against column order changes, though even slower.


docker exec -t database /usr/bin/pg_dump --clean --if-exists --create --username=directus --dbname=directus 2>/dev/null | gzip -9 > $ADMINDIR/data/postgres-backup.sql.gz 

echo "Finished Exporting Database"

echo "Exporting uploads from volume ..."
# Create temp container
docker run -v planter_uploads:/directus/uploads --name helper busybox true
# RUN container with mounted volume and extract
docker run --rm --volumes-from helper -v $ADMINDIR/data:/backup busybox sh -c "cd /backup && tar -C /directus/uploads -czf uploads_backup.tar ."
docker rm helper
echo "Finished Exporting Uploads"
