const Jasmine = require('jasmine');
const db = require('./db');

const jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');

const dbhost = process.env.DBHOST || process.env.IP || '127.0.0.1';
const dbname = process.env.DBNAME || 'lrs';
const connectionString = `mongodb://${dbhost}`;

db.connect(connectionString, dbname).then(() => jasmine.execute());
