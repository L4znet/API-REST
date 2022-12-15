const jwt = require('jsonwebtoken');
const User = require('../models/user');

const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { middleware: 'auth' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});


module.exports = (req, res, next) => { // next() sert à passer le relai au middleware suivant
    try {
        const email = req.headers.email;
        const token = req.headers.authorization;
        const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        User.findById(decodeToken.userId)
            .then((user) => {

                if (email == user.email) {
                    next();
                } else {
                    res.status(403).json({message: 'UNAUTHORIZED 1'});
                    logger.log({
                        level: 'error',
                        date:new Date(),
                        message: "UNAUTHORIZED 1",
                    });
                }
            })
            .catch(() => {
                res.status(403).json({message: 'UNAUTHORIZED 2'})
                logger.log({
                    level: 'error',
                    date:new Date(),
                    message: "UNAUTHORIZED 2",
                });
            })
    } catch {
        res.status(403).json({message: 'UNAUTHORIZED 3'})
        logger.log({
            level: 'error',
            date:new Date(),
            message: "UNAUTHORIZED 3",
        });
    }
};