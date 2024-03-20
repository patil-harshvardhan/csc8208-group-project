FROM postgres:14-alpine

# USER root


# Set environment variables
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB devdb

# ENV POSTGRES_USER root
# ENV POSTGRES_PASSWORD root
# ENV POSTGRES_DB devdb

# Set up replication
ENV PRIMARY_DB_HOST db
ENV PRIMARY_DB_PORT 5432
ENV REPLICATION_USER replicator
ENV REPLICATION_PASSWORD yourpassword


COPY ./start.sh /start.sh
COPY ./auto_run.exp /auto_run.exp
COPY ./backup.sh /backup.sh

RUN chmod 777 /start.sh
RUN chmod 777 /auto_run.exp
RUN chmod 777 /backup.sh

# COPY ./postgresql.conf /etc/postgresql.conf
COPY ./set-config.sh /docker-entrypoint-initdb.d/set-config.sh
# COPY ./start.sh /docker-entrypoint-initdb.d/start.sh
# RUN chmod 777 /postgresql.conf
RUN apk add --update sudo 
RUN apk add --update expect
RUN apk add --update openrc 

# RUN chmod 777 /etc/postgresql.conf
# RUN chown -R postgres:postgres /etc/postgresql.conf


# CMD ["postgres -c config_file=/etc/postgresql.conf"]
# CMD sudo -u postgres postgres
CMD [ "postgres", "-c", "config_file=/etc/postgresql.conf" ]
# CMD [ "/start.sh" ]
# ENTRYPOINT ["/start.sh"]