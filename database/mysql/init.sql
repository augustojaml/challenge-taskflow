-- =========================
-- 1. criar bancos de dados
-- =========================
CREATE DATABASE IF NOT EXISTS hubfyai_db;
CREATE DATABASE IF NOT EXISTS hubfyai_shadow;

-- =========================
-- 2. criar usuário (caso não exista)
-- =========================
CREATE USER IF NOT EXISTS 'hubfyai'@'%'
IDENTIFIED WITH mysql_native_password
BY 'hubfyai';

-- =========================
-- 3. garantir plugin compatível com Power BI
-- (essencial para evitar erro RSA)
-- =========================
ALTER USER 'hubfyai'@'%'
IDENTIFIED WITH mysql_native_password
BY 'hubfyai';

-- =========================
-- 4. conceder permissões
-- =========================
GRANT ALL PRIVILEGES ON hubfyai_db.* TO 'hubfyai'@'%';
GRANT ALL PRIVILEGES ON hubfyai_shadow.* TO 'hubfyai'@'%';

-- =========================
-- 5. aplicar alterações
-- =========================
FLUSH PRIVILEGES;
