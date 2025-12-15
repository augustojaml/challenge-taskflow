CREATE DATABASE IF NOT EXISTS hubfyai_shadow;

GRANT ALL PRIVILEGES ON hubfyai_db.* TO 'hubfyai'@'%';

GRANT ALL PRIVILEGES ON hubfyai_shadow.* TO 'hubfyai'@'%';

FLUSH PRIVILEGES;