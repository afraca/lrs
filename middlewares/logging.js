'use strict';

const crypto = require('crypto');

module.exports = logger => async function (ctx, next) {
    const start = new Date();
    const id = crypto.randomBytes(20).toString('hex');

    logger.verbose('Started request with id', id);

    try {
        await next();

        let currentLevel;
        if (ctx.status >= 500) {
            currentLevel = 'error';
        } else if (ctx.status >= 400) {
            currentLevel = 'warn';
        } else if (ctx.status >= 100) {
            currentLevel = 'info';
        }

        const done = () => {
            ctx.res.removeListener('finish', done);
            ctx.res.removeListener('close', done);

            const ms = new Date() - start;
            logger.log(
                    currentLevel,
                    ctx.ip,
                    ctx.method,
                    ctx.originalUrl,
                    ctx.status,
                    `${ms}ms`,
                    id
                );
        };
        ctx.res.once('finish', done);
        ctx.res.once('close', done);
    } catch (e) {
        logger.error(ctx.ip, ctx.method, ctx.originalUrl, e, id);
        throw e;
    }
};
