'use strict';

const MongoClient = require('mongodb').MongoClient;

const instance = {
    connect: (connection, dbName, options) =>
        MongoClient.connect(connection, options).then(client => {
            instance.client = client;
            instance.entityStructures = client.db(dbName).collection('entrityStructures');
            instance.statements = client.db(dbName).collection('statements');
            instance.results = client.db(dbName).collection('results');
        }),
    close: () => {
        if (instance.client) {
            instance.client.close();
            instance.client = null;
        }
    },
    entityStructures: undefined,
    statements: undefined,
    results: undefined
};

module.exports = instance;
