CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'yourpassword';


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);
-- INSERT INTO users (id, username, email, password) VALUES ('8dbde24a-7b64-4eac-ad74-1a399b94db69', 'xyz', 'abc@abc.com', '$2b$12$NIWqvpFS3dUPdG0sTXFAZ.NbFf92u6BpADa6gBsxmzuWaalrlxx46');
-- INSERT INTO users (id, username, email, password) VALUES ('2d7963ea-c4f4-4d90-9fe6-3c7e30c376be', 'user2', 'user2@user.com', '$2b$12$M1tIawsuFrawAdoLKDXTku4HOhvs5AiDXo2JuSjBY.k4v9sqF7Ihi');
-- INSERT INTO users (id, username, email, password) VALUES ('ccfbcb0e-c229-4a73-b496-7c030838dd96', 'user2', 'abc@abc.com', '$2b$12$tqd3Ub4q9Kvn7vsOnGWhZObLSaJ21MVXzBkrbFvT0Q4yaCVqlYbLG');

CREATE TABLE IF NOT EXISTS token (
    user_id UUID REFERENCES users(id),
    ip VARCHAR(255),
    access_token VARCHAR(450),
    refresh_token VARCHAR(450) NOT NULL,
    status BOOLEAN,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, access_token)
);
CREATE TABLE IF NOT EXISTS conversations (
    conv_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(255),
    sender_name VARCHAR(255),
    receiver_name VARCHAR(255) ,
    sender_id VARCHAR(255) ,
    receiver_id VARCHAR(255) ,
    msg_content VARCHAR ,
    msg_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(255) 
);
CREATE TABLE IF NOT EXISTS messages (
    msg_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    msg_content_sender_encrypted VARCHAR,
    msg_content_receiver_encrypted VARCHAR,
    msg_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    msg_type VARCHAR
);
CREATE TABLE IF NOT EXISTS user_keys (
    user_id UUID REFERENCES users(id),
    public_key VARCHAR,
    active BOOLEAN,
    PRIMARY KEY (user_id)
);


CREATE TABLE IF NOT EXISTS files (
  file_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  file_path VARCHAR(255) NOT NULL,
  sender_id varchar(255) NOT NULL,
  file_type VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);