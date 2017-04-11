const fs = require('fs');
const del = require('del');
const ncp = require('ncp').ncp;
const config = require('./config');

const OUTPUT_PATH = 'D:/Applications/lrs';
const ignore = ['.vscode', '.git', 'migration', '.gitignore', '.eslintrc', 'package.json',
    'mongod', 'deploy.js', 'deploy.bat', 'jsconfig.json', 'README.md'];

del.sync([`${OUTPUT_PATH}/**`], { force: true });
fs.mkdirSync(OUTPUT_PATH);

ncp('./', OUTPUT_PATH, err => {
    if (err) {
        return console.error(err);
    }
    for (let path of ignore) {
        del.sync([`${OUTPUT_PATH}/${path}`], { force: true });
    }
    transformConfig(process.env.CONFIG);
    console.log(`${process.env.CONFIG} app successfully deployed`);
});

function transformConfig(configuration) {
    let hosts = `hosts: [${arrayToStr(config.permissionsEndpoint.hosts)}],`;
    let apiKey = process.env.API_KEY || config.apiKey;

    switch (configuration) {
    case 'production': {
        hosts = 'hosts: [\'live.easygenerator.com\', \'beta.easygenerator.com\'],';
        break;
    }
    default: {
        break;
    }
    }

    let defaultData = fs.readFileSync(`${OUTPUT_PATH}/config.js`, 'utf-8');
    let transformedData = defaultData.replace(/hosts: ?\[[\s\S]*\],/, hosts).replace(config.apiKey, apiKey);
    fs.writeFileSync(`${OUTPUT_PATH}/config.js`, transformedData, 'utf-8');
}

function arrayToStr(array) {
    var _array = [];
    for (let elem of array) {
        if (elem instanceof RegExp) {
            _array.push(elem);
            continue;
        }
        _array.push(`'${elem}'`);
    }
    return _array.join(',');
}