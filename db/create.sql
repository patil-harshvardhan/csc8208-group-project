CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS token (
    user_id UUID REFERENCES users(id),
    access_token VARCHAR(450),
    refresh_token VARCHAR(450) NOT NULL,
    status BOOLEAN,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, access_token)
);
CREATE TABLE IF NOT EXISTS conversations (
    conv_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    typee VARCHAR(255),
    sender_name VARCHAR(255),
    receiver_name VARCHAR(255) ,
    sender_id VARCHAR(255) ,
    receiver_id VARCHAR(255) ,
    msg_content VARCHAR ,
    msg_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(255) 
);
