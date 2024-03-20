FROM postgres:14-alpine

# USER root 

# Copy custom configuration files
# RUN rm -f /var/lib/postgresql/data/postgresql.conf
# RUN rm -f /var/lib/postgresql/data/pg_hba.conf

# COPY postgresql.conf /var/lib/postgresql/data/postgresql.conf
# COPY pg_hba.conf /var/lib/postgresql/data/pg_hba.conf

# Set environment variables, already set in env file
# ENV POSTGRES_USER myuser
# ENV POSTGRES_PASSWORD mypassword
# ENV POSTGRES_DB mydb

# Create replication user

RUN echo "host    replication     replicator      0.0.0.0/0         md5" >> /usr/local/share/postgresql/pg_hba.conf.sample
# RUN echo "host replication replicator db_backup/32 md5" >> /etc/postgresql/pg_hba.conf
# RUN echo "host replication replicator db_backup/32 md5" >> /var/lib/postgresql/data/pg_hba.conf
# RUN echo "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'yourpassword';" > /docker-entrypoint-initdb.d/create_replication_user.sql

ADD *.sql /docker-entrypoint-initdb.d

# Expose port already set in docker-compose 
# EXPOSE 5432

CMD [ "-c", "config_file=/etc/postgresql.conf" ]