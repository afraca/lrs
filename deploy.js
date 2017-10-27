const fs = require('fs');
const del = require('del');
const ncp = require('ncp').ncp;
const config = require('./config');
const execSync = require('child_process').execSync;

const OUTPUT_PATH = 'D:/Applications/lrs';
const ignore = ['.vscode', '.git', 'migration', '.gitignore', '.eslintrc', 'package-lock.json',
    'mongod', 'deploy.js', 'deploy.bat', 'jsconfig.json', 'README.md', 'spec'
];

del.sync([`${OUTPUT_PATH}/**`], { force: true });
fs.mkdirSync(OUTPUT_PATH);

let configuration = process.env.CONFIG || 'development';

ncp('./', OUTPUT_PATH, {
    filter: file => !file.includes('node_modules')
},
    err => {
        if (err) {
            return console.error(err);
        }

        execSync('npm i --production', {
            cwd: OUTPUT_PATH,
            stdio: [0, 1, 2]
        });

        for (let path of ignore) {
            del.sync([`${OUTPUT_PATH}/${path}`], { force: true });
        }
        transformConfig();
        console.log(`${configuration} app successfully deployed`);
    });

function transformConfig() {
    let data = fs.readFileSync(`${OUTPUT_PATH}/config.js`, 'utf-8');

    switch (configuration) {
    case 'production':
        {
            data = data.replace(/hosts: ?\[[\s\S]*\],/, 'hosts: [\'live.easygenerator.com\', \'beta.easygenerator.com\'],');
            data = data.replace('tokens-staging.easygenerator.com', 'tokens.easygenerator.com');
            break;
        }
    default:
        {
            break;
        }
    }

    if (process.env.TOKENS_API_KEY) {
        data = data.replace(config.tokensApiKey, process.env.TOKENS_API_KEY);
    }

    if (process.env.APP_API_KEY) {
        data = data.replace(config.appApiKey, process.env.APP_API_KEY);
    }

    fs.writeFileSync(`${OUTPUT_PATH}/config.js`, data, 'utf-8');
}