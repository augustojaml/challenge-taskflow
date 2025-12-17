# Setup MySQL 8 com Docker (PowerShell)

Este guia cria um container MySQL 8, configura o usuário root, cria as duas databases (`hubfyai_db` e `hubfyai_shadow`),
concede permissões e executa o SQL de criação das tabelas.

---

## 1. Subir o MySQL 8

```powershell
docker run -d --name hubfyai-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8.0 --default-authentication-plugin=mysql_native_password
```

Aguarde cerca de 10–20 segundos para o banco inicializar.

---

## 2. Acessar o MySQL como root

```powershell
docker exec -it hubfyai-mysql mysql -u root -proot
```

---

## 3. Criar databases, usuário e permissões

Execute no prompt do MySQL:

```sql
CREATE DATABASE IF NOT EXISTS hubfyai_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS hubfyai_shadow
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'hubfyai'@'%' IDENTIFIED
WITH mysql_native_password BY 'hubfyai';

GRANT ALL PRIVILEGES ON hubfyai_db.* TO 'hubfyai'@'%';
GRANT ALL PRIVILEGES ON hubfyai_shadow.* TO 'hubfyai'@'%';

FLUSH PRIVILEGES;
```

---

## 4. Executar criação das tabelas

Execute o script abaixo **após** os comandos acima.

```sql
-- =====================================================
-- DATABASE: hubfyai_db
-- =====================================================

CREATE DATABASE IF NOT EXISTS hubfyai_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hubfyai_db;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    email VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    password_hash VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL,
    avatar_url VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_key (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tasks (
    id CHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    user_id CHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    title VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    description TEXT COLLATE utf8mb4_unicode_ci,
    status ENUM ('PENDING','IN_PROGRESS','COMPLETED')
      COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL,
    PRIMARY KEY (id),
    KEY tasks_user_id_idx (user_id),
    CONSTRAINT tasks_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users (id)
      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DATABASE: hubfyai_shadow
-- =====================================================

CREATE DATABASE IF NOT EXISTS hubfyai_shadow DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hubfyai_shadow;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    email VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    password_hash VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL,
    avatar_url VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_key (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tasks (
    id CHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    user_id CHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    title VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    description TEXT COLLATE utf8mb4_unicode_ci,
    status ENUM ('PENDING','IN_PROGRESS','COMPLETED')
      COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL,
    PRIMARY KEY (id),
    KEY tasks_user_id_idx (user_id),
    CONSTRAINT tasks_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users (id)
      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 5. Validação rápida

```sql
SHOW DATABASES;
USE hubfyai_db;
SHOW TABLES;
USE hubfyai_shadow;
SHOW TABLES;
```

---

Pronto. Ambiente compatível com MySQL 8, Prisma, shadow database e testes E2E.
