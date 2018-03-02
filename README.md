# lrs

Service that stores learners results in xApi format.

## Getting Started

### Prerequisites

1. Install NodeJS v8.x.
2. Install MongoDB v3.4 (or latest).

### Configuring database
1. Run MongoDB.
2. Create "statements" and "results" collection within "lrs" DB.

    ```
    use lrs
    db.createCollection("statements");
    db.createCollection("results");
    db.createCollection("entityStructures");
    ```

3. Create indexes for most frequently used filter properties:

    ```
    use lrs
    db.statements.createIndex({ "context.extensions.http://easygenerator/expapi/course/id" : 1});
    db.statements.createIndex({ "context.extensions.http://easygenerator/expapi/learningpath/id" : 1});
    db.statements.createIndex({ "verb.id" : 1});
    db.statements.createIndex({ "context.registration" : 1});

    db.results.createIndex({ "id" : 1, "last_activity": -1, "is_archived": -1 });
    db.results.createIndex({ "attempt_id" : 1 });

    db.entityStructures.createIndex({ "entityId" : 1 });
    db.entityStructures.createIndex({ "entityId" : 1, "entityType": 1 });
    ```


### Setting up Dev

1. Clone the repository locally.
2. Run npm install.
3. Configure environment variables. 
```
  LOG_LEVEL (default: warn)
  PORT (default: 3000)

  DBHOST (default: 127.0.0.1) 
  DBNAME (default: lrs) 
  DBCONNECTIONTIMEOUT (default: 60000)
  DBSOCKETTIMEOUT (default: 300000)

  PERMISSIONS_ENDPOINT_HOSTS (default: localhost /^\S+\.easygenerator.com$/)

  TOKENS_URI (default: tokens-staging.easygenerator.com)
  TOKENS_API_KEY (default: undefined)
  APP_API_KEY (default: undefined)
```
You can check config.js for additional configuration options.

4. Run application.

### Coding style tests

Run eslint coding style tests `npm run lint`.

### Bumping version

`npm version major | minor | patch`

This updates a version number in package.json and creates a corresponding tag on GitHub.

### Docker support

You can build and run application using Docker.

For example:
- To build: `docker build -t lrs .`
- To run: `docker run -e DBHOST="192.168.99.100" -e PERMISSIONS_ENDPOINT_HOSTS="localhost /^\S+\.easygenerator.com$/" -e TOKENS_URI="tokens-staging.easygenerator.com" -p 3000:3000 lrs`

OR

You can user docker-compose with docker-compose.yaml file whicn builds and runs LRS + mongodb. Do not use it in production.

```
docker-compose build
docker-compose up
```