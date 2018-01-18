const fs = require('fs');

module.exports = {
    async readFile(path, encoding) {
        encoding = encoding || 'utf8';
        return new Promise((resolve, reject) => {
            fs.readFile(path, encoding, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
};