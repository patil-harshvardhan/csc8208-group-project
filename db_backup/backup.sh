#!/bin/sh                                                                                                                                                                                                                                                             
sudo -u postgres pg_dump -h db -p 5432 -U postgres devdb > backup.sql                                                                                                                                                                                                        
sudo -u postgres psql -c '\c devdb' -c 'DROP SCHEMA public CASCADE;' -c 'CREATE SCHEMA public;' -c '\q'
sudo -u postgres psql -d devdb < backup.sql

