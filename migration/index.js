const fs = require('fs');
const _ = require('underscore');
const db = require('../db');
const constants = require('../constants');

module.exports = {
    async build() {
        var moreThanOneAttemptCount = 0;
        var moreThan100AttemptCount = 0;
        var ids = await this.getIds();
        for (let i = 0; i < ids.length; i++) {
            let statements = await this.getRootStatements(ids[i]);
            for (let j = 0; j < statements.length; j++) {
                let attemptId = statements[j]._id;
                if (!attemptId) {
                    continue;
                }
                let child = await this.getEmbededStatements(statements[j]._id);
                if (!child || !child.length) {
                    continue;
                }
                let maxTimestamp = _.max(child, statement => statement.timestamp);
                if (maxTimestamp && maxTimestamp > statements[j].last_activity) {
                    statements[j].last_activity = maxTimestamp;
                }

                let mastered = this.findStatementGroupById(child,
                    constants.statementsVerbs.mastered);
                let answered = this.findStatementGroupById(child,
                    constants.statementsVerbs.answered);
                let experienced = this.findStatementGroupById(child,
                    constants.statementsVerbs.experienced);
                let progressed = this.findStatementGroupById(child,
                    constants.statementsVerbs.progressed);

                statements[j].embeded = this.mapEmbededResults(mastered,
                    progressed, answered, experienced);
            }

            for (let k = 0; k < statements.length; k++) {
                let object = statements[k];

                object.id = ids[i];
                object.attempt_id = object._id;
                delete object._id;
                await db.results.insert(object);
            }

            console.log(`${i} / ${ids.length}`);
            if (statements.length > 100) {
                moreThan100AttemptCount++;
            } else if (statements.length > 1) {
                moreThanOneAttemptCount++;
            }
        }
        console.log(`Courses with more than 100 attempts: ${moreThan100AttemptCount}`);
        console.log(`Courses with more than 1 attempt: ${moreThanOneAttemptCount}`);
        console.log(`Total courses: ${ids.length}`);
    },
    async getIds(storeInfile) {
        try {
            let ids = await db.statements.distinct('context.extensions.http://easygenerator/expapi/course/id');
            if (storeInfile) {
                await this.writeToFile('migration/tmp_files/ids.json', ids);
            }
            console.log('successfully got ids');
            return ids;
        } catch (err) {
            console.error('failed to get ids');
            return null;
        }
    },
    async getRootStatements(id) {
        var rootStatements = await db.statements.aggregate([
            {
                $match: { $and: [
                    { 'context.extensions.http://easygenerator/expapi/course/id': id },
                    { $or: [
                        {
                            $and: [{ 'verb.id': constants.statementsVerbs.started }, { 'context.registration': { $exists: true } }]
                        },
                        {
                            $and: [
                                { 'verb.id': constants.statementsVerbs.progressed },
                                { 'context.registration': { $exists: true } },
                                { 'object.definition.type': constants.activityTypes.course }
                            ]
                        },
                        { 'verb.id': { $in: [constants.statementsVerbs.passed, constants.statementsVerbs.failed] } }
                    ] }
                ] }
            },
            { $project: { attemptId: { $ifNull: ['$context.registration', '$_id'] }, statement: '$$ROOT' } },
            { $group: { _id: '$attemptId', last_activity: { $max: '$statement.timestamp' }, first_activity: { $min: '$statement.timestamp' }, root: { $push: '$$ROOT.statement' } } }
        ], { allowDiskUse: true, cursor: { batchSize: 500 } });
        return rootStatements;
    },
    getEmbededStatements(attemptId) {
        return db.statements.aggregate([
            {
                $match: { $and: [
                    { 'context.registration': attemptId },
                    { $or: [
                        {
                            'verb.id': { $in: [
                                constants.statementsVerbs.mastered,
                                constants.statementsVerbs.answered,
                                constants.statementsVerbs.experienced
                            ] }
                        },
                        {
                            $and: [
                                { 'verb.id': constants.statementsVerbs.progressed },
                                { 'object.definition.type': constants.activityTypes.objective }
                            ]
                        }]
                    }
                ] }
            },
            {
                $group: {
                    _id: '$verb.id', timestamp: { $max: '$$ROOT.timestamp' }, statements: { $push: '$$ROOT' }
                }
            }
        ], { allowDiskUse: true, cursor: { batchSize: 500 } });
    },
    writeToFile(name, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(name, JSON.stringify(data), err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    },
    findStatementGroupById(statements, id) {
        return _.find(statements, statement => statement._id === id);
    },
    mapEmbededResults(masteredGroup, progressedGroup, answeredGroup, experiencedGroup) {
        var embededStatements = this.groupEmbededStatements(masteredGroup, progressedGroup);
        return embededStatements ? _.map(embededStatements, statementGroup => ({
            objectId: statementGroup[0].object && statementGroup[0].object.id,
            last_activity: statementGroup[0].timestamp,
            root: statementGroup,
            answered: this.mapChildStatements(answeredGroup, statementGroup[0]),
            experienced: this.mapChildStatements(experiencedGroup, statementGroup[0])
        })) : embededStatements;
    },
    groupEmbededStatements(masteredGroup, progressedGroup) {
        var allStatements = null;
        if (masteredGroup && masteredGroup.statements) {
            allStatements = masteredGroup.statements;
        }
        if (progressedGroup && progressedGroup.statements) {
            allStatements = allStatements ?
                allStatements.concat(progressedGroup.statements) : progressedGroup.statements;
        }
        if (!allStatements) {
            return null;
        }
        let groupedStatements = [];
        let statements = allStatements.sort((statement1, statement2) => {
            let statement1Object = statement1.object || {};
            let statement2Object = statement2.object || {};
            if (statement1Object.id && statement1Object.id === statement2Object.id) {
                return ((new Date(statement1.timestamp)).getTime() <
                    (new Date(statement2.timestamp)).getTime()) ? 1 : -1;
            }
            return statement1Object.id ? (statement1Object.id > statement2Object.id) ? 1 : -1 : -1;
        });

        groupedStatements.push([statements[0]]);
        for (let i = 1; i < statements.length; i++) {
            let groupStatement = groupedStatements[groupedStatements.length - 1][0];
            let id = statements[i].object && statements[i].object.id;
            let groupId = groupStatement.object && groupStatement.object.id;

            if (id && groupId === id) {
                groupedStatements[groupedStatements.length - 1].push(statements[i]);
            } else {
                groupedStatements.push([statements[i]]);
            }
        }
        return _.sortBy(groupedStatements, item => -(new Date(item[0].timestamp)).getTime());
    },
    mapChildStatements(statementGroup, parentStatement) {
        return statementGroup && statementGroup.statements ?
            _.filter(statementGroup.statements, element => {
                try {
                    return _.some(element.context.contextActivities.parent, item =>
                        item.id === parentStatement.object.id);
                } catch (e) {
                    return false;
                }
            }) : null;
    }
};