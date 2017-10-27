# lrs

Service that stores learners results in xApi format.

## Getting Started

### Prerequisites

1. Install NodeJS v7.x.
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

    db.results.createIndex({ "id" : 1, "last_activity": -1 });
    db.results.createIndex({ "attempt_id" : 1 });

    db.entityStructures.createIndex({ "entityId" : 1 });
    db.entityStructures.createIndex({ "entityId" : 1, "entityType": 1 });
    ```


### Setting up Dev

1. Clone the repository locally.
2. Run npm install.
3. Configure environment variables `config.js` file if needed.
4. Run application. You can use vscode command `Launch Program`.

### Coding style tests

Run eslint coding style tests `npm run lint`.

## Deployment

1. Run npm install.
2. Modify `config.js` file if needed.
3. To build the deployment package run
  ```
    deploy.bat {config [development|production]} {tokensApiKey} {appApiKey}
  ```
By default package will be created at `D:/Applications/lrs` folder.