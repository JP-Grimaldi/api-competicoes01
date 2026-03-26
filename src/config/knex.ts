import knex from 'knex';

export const db = knex({
    client: "mysql2",
    connection: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "senacrs",
        database: "gerenciador_convidados"
    },
});