const path = require('path'),
config = require('config');

const { failure_callback,  checkVar } = require(path.resolve(config.get('app.helperDir'),'common'));


module.exports = {

    PackageValidation: function(req, res, next) {

        try {

            var {dataTime,packageName} = req.body;

            if (checkVar(packageName)) {

                return failure_callback(res, ['packageName is required', 400]);
            }
            else if (checkVar(dataTime)) {

                return failure_callback(res, ['dataTime is required', 400]);
            }
            else if (checkVar(req.files)) {

                return failure_callback(res, ['imageAndVideoFiles is required', 400]);
            } else return next();

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },


    updatePackageValidation: function(req, res, next) {

        try {

            var {id,dataTime,packageName} = req.body;

            if (checkVar(packageName)) {

                return failure_callback(res, ['packageName is required', 400]);
            }
           else if (checkVar(id)) {

                return failure_callback(res, ['package id is required', 400]);
            }
            else if (checkVar(dataTime)) {

                return failure_callback(res, ['dataTime is required', 400]);
            }
            else if (checkVar(req.files)) {

                return failure_callback(res, ['imageAndVideoFiles is required', 400]);
            } else return next();

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },


    PackageIdValidation: function(req, res, next) {

        try {

            var id = req.query.id;

            if (checkVar(id)) {

                return failure_callback(res, ['package id is required', 400]);
            }
            else return next();

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },


}