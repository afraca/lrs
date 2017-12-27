'use strict';

const db = require('../db');
const constants = require('../constants');
const jsonStream = require('../utils/jsonStream');

var fields = {
    root: 1,
    attempt_id: 1,
    first_activity: 1,
    last_activity: 1
};

module.exports = {
    getRoot(id, specifiedSkip, specifiedLimit, since, until) {
        return this.get(Object.assign({}, fields), id,
            specifiedSkip, specifiedLimit, since, until);
    },
    getFull(id, specifiedSkip, specifiedLimit, since, until) {
        return this.get(Object.assign({ embeded: 1 }, fields), id,
            specifiedSkip, specifiedLimit, since, until);
    },
    async get(_fields, id, specifiedSkip, specifiedLimit, since, until) {
        let criteria = { id, is_archived: { $ne: true } };

        if (since) {
            criteria.last_activity = { $gte: since };
        }

        if (until) {
            if (!criteria.last_activity) {
                criteria.last_activity = {};
            }
            criteria.last_activity.$lte = until;
        }

        let skip;
        let limit;
        if (!criteria.last_activity) {
            skip = specifiedSkip || constants.defaultSkip;
            limit = specifiedLimit || constants.defaultLimit;
        }

        let cursor = await db.results.find(criteria, {
            fields: _fields,
            sort: { last_activity: -1 },
            skip,
            limit,
            rawCursor: true
        });
        return cursor.stream().pipe(jsonStream.stringify(transform).apply(this, getJsonStreamWrapperParameters('statements')));
    },
    getAttempt(attemptId) {
        return db.results.findOne({ attempt_id: attemptId });
    },
    getIdByAttemptId(attemptId) {
        return db.results.findOne({ attempt_id: attemptId }, { fields: { id: 1 } });
    },
    insert(result) {
        return db.results.insert(result);
    },
    markAsArchived(attemptId) {
        return db.results.update({ attempt_id: attemptId }, { $set: { is_archived: true } });
    },
    unmarkAsArchived(attemptId) {
        return db.results.update({ attempt_id: attemptId }, { $set: { is_archived: false } });
    },
    markRootAsModified(_id, lastActivity) {
        return db.results.update({ _id }, { $set: { last_activity: lastActivity } });
    },
    markEmbededAsModified(_id, objectId, lastActivity) {
        return db.results.update({ _id, 'embeded.objectId': objectId }, { $set: { 'embeded.$.last_activity': lastActivity } });
    },
    pushToRoot(_id, statement) {
        return db.results.update({ _id }, { $push: { root: statement } });
    },
    pushToEmbeded(_id, embeded) {
        return db.results.update({ _id, 'embeded.objectId': { $nin: [embeded.objectId] } }, { $addToSet: { embeded } });
    },
    pushToEmbededRoot(_id, objectId, statement) {
        return db.results.update({ _id, 'embeded.objectId': objectId }, { $push: { 'embeded.$.root': statement } });
    },
    pushToAnswered(_id, objectId, statement) {
        return db.results.update({ _id, 'embeded.objectId': objectId }, { $push: { 'embeded.$.answered': statement } });
    },
    pushToExperienced(_id, objectId, statement) {
        return db.results.update({ _id, 'embeded.objectId': objectId }, { $push: { 'embeded.$.experienced': statement } });
    }
};

function getJsonStreamWrapperParameters(wrapper) {
    return [`{"${wrapper}":[`, ',', ']}'];
}

function getComparator(dateFieldName) {
    return (a, b) => ((new Date(a[dateFieldName])).getTime() <
        (new Date(b[dateFieldName])).getTime()) ? 1 : -1;
}

function transform(result) {
    if (!result) {
        return;
    }
    if (result.root && result.root.length) {
        result.root = result.root.sort(getComparator('timestamp'));
    }
    if (result.embeded && result.embeded.length) {
        result.embeded = result.embeded.sort(getComparator('last_activity'));
        result.embeded.forEach(group => {
            if (group.root && group.root.length) {
                group.root = group.root.sort(getComparator('timestamp'));
            }
            if (group.answered && group.answered.length) {
                group.answered = group.answered.sort(getComparator('timestamp'));
            }
            if (group.experienced && group.experienced.length) {
                group.experienced = group.experienced.sort(getComparator('timestamp'));
            }
        });
    }
}