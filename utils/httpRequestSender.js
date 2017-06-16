const request = require('request-promise');

module.exports = {
    post(url, data, headers) {
        return request({
            method: 'POST',
            uri: url,
            body: data,
            headers,
            json: true,
            resolveWithFullResponse: true
        });
    },
    async get(url, headers) {
        var response = await request({
            method: 'GET',
            uri: url,
            headers,
            json: true,
            resolveWithFullResponse: true
        });

        return response.body;
    }
};