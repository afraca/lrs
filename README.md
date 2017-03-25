# Deployment


## Before deployment

1. Install nodejs [v7.xx.xx](http://nodejs.org/dist/)
2. Install iisnode for IIS 7.x/8.x: [x86](https://github.com/azure/iisnode/releases/download/v0.2.16/iisnode-full-v0.2.16-x86.msi) or [x64](https://github.com/azure/iisnode/releases/download/v0.2.16/iisnode-full-v0.2.16-x64.msi)
3. Install [URL Rewrite](http://www.iis.net/download/URLRewrite) for IIS
4. Install Mongo DB [2.6.7 (or latest)](http://www.mongodb.org/downloads)

## Deployment

### Configuring database
1. Run Mongo DB as [win service](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/#run-the-mongodb-service)
2. Create "statements" and "results" collection within "lrs" DB.

    ```
    use lrs
    db.createCollection("statements");
    db.createCollection("results");
    ```

3. Create indexes for most frequently used filter properties:

    ```
    use lrs
    db.statements.ensureIndex({ "context.extensions.http://easygenerator/expapi/course/id" : 1});
    db.statements.ensureIndex({ "context.extensions.http://easygenerator/expapi/learningpath/id" : 1});
    db.statements.ensureIndex({ "verb.id" : 1});
    db.statements.ensureIndex({ "context.registration" : 1});

    db.results.ensureIndex({ "id" : 1, "last_activity": -1 });
    db.results.ensureIndex({ "attempt_id" : 1 });
    ```

4. Create "accessTokens" collection within "tokens" DB.

    ```
    use tokens
    db.createCollection("accessTokens");
    ```

5. Create indexes for most frequently used filter properties:

    ```
    use tokens
    db.accessTokens.ensureIndex({ "id" : 1 });
    db.accessTokens.ensureIndex({ "entityId" : 1 });
    ```

### Installing website
1. Clone this Git repository locally
2. Run `npm install` in the root
3. Create `web.config` file in the root to register iisnode module as a handler for our `app.js` file and to configure URL rewriting module:

    ```
    <configuration>
      <system.webServer>
        <handlers>
          <add name="iisnode" path="app.js" verb="*" modules="iisnode" />
        </handlers>
        <rewrite>
          <rules>
            <rule name="lrsApp">
              <match url="/*" />
              <action type="Rewrite" url="app.js" />
            </rule>
          </rules>
        </rewrite>
        <defaultDocument enabled="true">
          <files>
            <add value="app.js" />
          </files>
        </defaultDocument>
        <httpErrors existingResponse="PassThrough"></httpErrors>
      </system.webServer>
      <appSettings>
        <add key="IP" value="127.0.0.1" />
        <add key="PORT" value="80" />
      </appSettings>
    </configuration>
    ```

4. Create 'iisnode.yml' file in the root to override default node run options and to specify `--harmony` flag

    `nodeProcessCommandLine: node.exe --harmony #full path can be used here as well`

5. Modify `config.js` file for your environment if needed.
6. Set `CONFIG` environment variable to build for `development` or `production`, `API_KEY` variable to change secret API key, and run `node deploy.js` command to build your package.
   By default package will be created at `D:/Applications/lrs` folder.

7. Copy generated package to your server.
8. Create Web site in IIS and add corresponding site bindings and permissions
9. To generate results into results collection from existing data in statements collection run:

    `node migration/exec.js`

### Using a different server to host Mongodb
If your mongodb instance is hosted under a non-default location, set the `DBHOST` and `DBNAME` environment variables, and the lrs will connect to `mongodb://${DBHOST}/${DBNAME}` instead.
For example, in the IIS config, simply add `<app key="DBHOST" value="..." />` and `<app key="DBNAME" value="..." />` to the `<appSettings>` element.

Resources
-----------
1. [Hosting node.js applications in IIS on Windows](https://github.com/tjanczuk/iisnode)
2. [Getting started with Mongo DB](http://docs.mongodb.org/manual/tutorial/getting-started/)