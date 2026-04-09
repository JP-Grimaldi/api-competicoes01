CREATE DATABASE IF NOT EXISTS gerenciador_convidados;
USE gerenciador_convidados;
CREATE TABLE convidado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    telefone VARCHAR(25) NOT NULL UNIQUE
    status BOOLEAN DEFAULT FALSE
);

-- status = "pendente" e "confirmado"