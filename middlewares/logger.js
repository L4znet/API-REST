const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { middleware: 'logger' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});


module.exports = (req, res, next) => { // next() sert à passer le relai au middleware suivant
    try {
        logger.log({
            level: 'info',
            date:new Date(),
            message: "INFO : Je suis au bon endroit",
        });
        next();
    } catch {
        logger.log({
            level: 'error',
            date:new Date(),
            message: "Erreur au niveau du middleware : logger",
        });
        res.status(501).json({message: 'Erreur au niveau du middleware : logger'})
    }
};