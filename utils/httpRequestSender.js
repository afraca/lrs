const request = require('request-promise');

module.exports = {
    post(url, data, headers) {
        return request({
            method: 'POST',
            uri: url,
            body: data,
            headers: headers,
            json: true,
            resolveWithFullResponse: true
        });
    }
};