'use strict'

const promise = require("bluebird");
const Knex = require('knex');

function connect() {
    var config = {
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE
    };

    if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
        config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
    }
    if (process.env.NODE_ENV === 'development') {
        config = {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'sakila'
        };
    }

    const knex = Knex({
        client: 'mysql',
        connection: config
    });
    return knex;
}

const knex = connect();

const QueryRequest = sql => {
    return new promise((resolve, reject) => {
        knex.raw(sql)
            .then((rows) => {
                resolve(rows[0]);
            });
    })
}

module.exports = {
    QueryRequest
}