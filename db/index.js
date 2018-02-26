'use strict';

const MongoClient = require('mongodb').MongoClient;

const instance = {
    connect: (connection, dbName) =>
        MongoClient.connect(connection).then(client => {
            instance.entityStructures = client.db(dbName).collection('entrityStructures');
            instance.statements = client.db(dbName).collection('statements');
            instance.results = client.db(dbName).collection('results');
        }),
    entityStructures: undefined,
    statements: undefined,
    results: undefined
};

module.exports = instance;
