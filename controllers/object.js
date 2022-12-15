const Object = require('../models/object');

const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { controller: 'object' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});


logger.log({
    level: 'info',
    date:new Date(),
    message: "Début de l'exécution du controller object",
});



exports.getObjectList = (req, res, next) => {
    logger.log({
        level: 'info',
        date:new Date(),
        message: "Méthode getObjectList",
    });

    Object.find()
        .then((list) => res.status(200).json(list))
        .catch((err) => {
            logger.log({
                level: 'error',
                date:new Date(),
                message: "NOT FOUND " + err,
            });
            res.status(404).json({message: 'NOT FOUND'});
        })
}

exports.getObject = (req, res, next) => {
    logger.log({
        level: 'info',
        date:new Date(),
        message: "Méthode getObject" + req.params,
    });
    Object.findById(req.params.id)
            .then((obj) => res.status(200).json(obj))
            .catch((err) => {
                logger.log({
                    level: 'error',
                    date:new Date(),
                    message: "NOT FOUND " + err,
                });
                res.status(404).json({message: 'NOT FOUND'});
            })
}

exports.createObject = (req, res, next) => {
    logger.log({
        level: 'info',
        date:new Date(),
        message: "Méthode createObject " + req.body,
    });

    let obj = new Object({
        name: req.body.name,
        weight: req.body.weight,
        url: req.body.url,
        creationDate: new Date(),
        modificationDate: new Date(),
        active: true
    })

    obj.save().then((saved) => res.status(200).json(saved)).catch(() => {
        res.status(500).json({message: 'API REST ERROR: Pb avec la creation'})
        logger.log({
            level: 'error',
            date:new Date(),
            message: "API REST ERROR : Pb avec la création ",
        });
    })
}

exports.updateObject = (req, res, next) => {
    logger.log({
        level: 'info',
        date:new Date(),
        message: "Méthode updateObject " + req.params.id + 'body : ' + req.body,
    });

    Object.findById(req.params.id)
        .then((obj) => {
            req.body.modificationDate = new Date();
            Object.updateOne({ _id: obj.id}, req.body)
                .then((result) => res.status(200).json(result))
                .catch((err) => {
                    res.status(500).json({message: 'CANNOT UPDATE', error: err})
                    logger.log({
                        level: 'error',
                        date:new Date(),
                        message: "CANNOT UPDATE " + err,
                    });
                })
        })
        .catch(() => {
            res.status(404).json({message: 'NOT FOUND'})
            logger.log({
                level: 'error',
                date:new Date(),
                message: "NOT FOUND findbyId",
            });
        })
}

exports.deleteObject = (req, res, next) => {
    logger.log({
        level: 'info',
        date:new Date(),
        message: "Méthode deleteObject " + req.params.id,
    });

    Object.findByIdAndDelete(req.params.id)
        .then((result) => {
         if (result) {
            res.status(200).json(result)
         } else {
            res.status(500).json({message: 'ALREADY DELETED'})
             logger.log({
                 level: 'error',
                 date:new Date(),
                 message: "ALREADY DELETED OBJECT",
             });
         }
        })
        .catch((err) => {
            logger.log({
                level: 'error',
                date:new Date(),
                message: "NOT FOUND : " + err,
            });
            res.status(400).json({message: 'NOT FOUND', error: err})
        })
}
