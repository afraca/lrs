const migrationManager = require('../migration');

migrationManager.build().then(() => {
    console.log('finished');
}).catch(err => { throw err; });