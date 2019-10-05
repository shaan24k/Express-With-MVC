const fs = require('fs'),
    path = require('path'), 
    rimraf = require('rimraf'),
    config = require('config');

    const staticDir = `${config.get('dir.public')}/${config.get('dir.pkg')}`;
    const packageModel = require(path.resolve(config.get('app.modelDir'),'package'));


const { failure_callback, 
        success_callback } = require(path.resolve(config.get('app.helperDir'),'common'));


module.exports = {

    addPackage: function(req, res) {

        try {

            let data = {};
            let TotalDuration = 0;
            const {dataTime,packageName} = req.body;

            data.dataTime = dataTime,
            data.packageName = packageName;
           

            packageModel.packageDuplicacy(['name', data.packageName], function(err, row) {

                if (err) return failure_callback(res, ['error in query', 500]);

                else

                if (row[0] == 'error') {

                    return failure_callback(res, ['error in query', 500]);

                } else


                if (row[1] > 0) {

                    return failure_callback(res, ['Package name allready exists.', 400]);
                } else

                    packageModel.addPackage(data, async function(err, row) {

                    if (err) return failure_callback(res, ['error in query', 500]);

                    else

                    if (row[0] == 'error') {

                        return failure_callback(res, ['error in query', 500]);

                    } else {

                        var dir = `${staticDir}/${data.packageName}`;
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir, { recursive: true });
                        }

                       var datetimeArray = data.dataTime.split(',');

                        for (var i = 0; i < req.files.length; i++) {

                            req.files[i].pkgId = row[1];
                            req.files[i].duration = datetimeArray[i];
                            TotalDuration = (+TotalDuration + +datetimeArray[i]);


                            await addPkg(data.packageName, req.files[i]).then(function(rest) {

                                if ((i + 1) == req.files.length) {

                                    packageModel.updateDuration([row[1], TotalDuration], function(err, row2) {

                                        if (err) {

                                            return failure_callback(res, ['error in query', 500]);

                                        } else {

                                           return success_callback(res,['','package added successfully']);

                                        }

                                    })
                                }

                            });

                        }


                    }


                })

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);
    
        }
    },



    updatePackage: function(req, res) {

        try {

            let data = {};
            let TotalDuration = 0;
            const {id,dataTime,packageName} = req.body;

            data.Id = id,
            data.dataTime = dataTime,
            data.packageName = packageName;

            packageModel.packageDuplicacy(['id', data.Id], function(err, row) {

                if (err) return failure_callback(res, ['error in query', 500]);

                else

                if (row[0] == 'error') {

                    return failure_callback(res, ['error in query', 500]);

                } else


                if (row[1] > 0) {

                    var dir = `${staticDir}/${data.packageName}`;

                    rimraf(`./${dir}/*`, function() { console.log('done'); });

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }


                    packageModel.deletePkgDetail(data.Id, async function(err, row) {

                        if (err) return failure_callback(res, ['error in query', 500]);

                        else

                        if (row[0] == 'error') {

                            return failure_callback(res, ['error in query', 500]);

                        } else

                            var datetimeArray = data.dataTime.split(',');

                            for (var i = 0; i < req.files.length; i++) {

                            req.files[i].pkgId = data.Id;
                            req.files[i].duration = datetimeArray[i];
                            TotalDuration = (+TotalDuration + +datetimeArray[i]);

                            await addPkg(data.packageName, req.files[i]).then(async function(rest) {

                                console.log(`${(i+1)} : ${req.files.length}`);

                                if ((i + 1) == req.files.length) {

                                    console.log('update total duration');

                                    await packageModel.updateDuration([data.Id, TotalDuration], function(err, row2) {

                                        if (err) {

                                            return failure_callback(res, ['error in query', 500]);

                                        } else {

                                            return success_callback(res, ['','package updated successfully']);

                                        }

                                    })
                                }

                            });

                        }


                    })


                } else

                    return failure_callback(res, ['Package is not exists.', 400]);
            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);
    
        }
    },


    getAllPackagesList: function(req, res) {

        try {

            var data = [];

            packageModel.getallPackagesList(data, function(err, row) {

                if (err) return failure_callback(res, ['error in query', 500]);

                else

                if (row[0] == 'error') {

                    return failure_callback(res, ['error in query', 500]);

                } else {

                   return success_callback(res,[row[1],'packages list']);

                }

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }
    },

    getPackageDetail: function(req, res) {

        try {

            let Id = req.query.id.trim();

            packageModel.getPackageDetail(Id, function(err, row) {

                if (err) return failure_callback(res, ['error in query', 500]);

                else

                if (row[0] == 'error') {

                    return failure_callback(res, ['error in query', 500]);

                } else {

                    let data = {
                        id: '',
                        package: '',
                        totalDuration: '',
                        path: '',
                        detail: []
                    };

                    row[1].forEach(rest => {

                        data.id = rest.id;
                        data.package = rest.package;
                        data.totalDuration = rest.totalDuration;
                        data.path = `${staticDir}/${rest.package}`;
                        data.detail.push({ file: rest.file, type: rest.type, duration: rest.duration });

                    });

                    return success_callback(res,[data,'package Detail']);

                }

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }
    },


    deletePackage: function(req, res) {

        try {

            let Id = req.query.id.trim();

            packageModel.getPackageNameById(Id, function(err, row) {

                if (err) return failure_callback(res, ['error in query', 500]);

                else

                if (row[0] == 'error') {

                    return failure_callback(res, ['error in query', 500]);

                } else if (row[0] == 'failure') {

                    return failure_callback(res, ['package not exists', 400]);
                } else

                    console.log(row[1]);

                var dir = `${staticDir}/${row[1]}`;

                rimraf(`./${dir}`, function() { console.log('done'); });

                packageModel.deleteEntirePackage(Id, function(err, row2) {

                    if (err) return failure_callback(res, ['error in query', 500]);

                    else

                    if (row2[0] == 'error') {

                        return failure_callback(res, ['error in query', 500]);

                    } else {

                        return success_callback(res,['','package deteled successfully']);

                    }

                })

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },




}




function addPkg(name, file) {

    try {

        return new Promise((resolve, reject) => {

            if (name == null || name == '' || name == null || name == '') {

                console.log('iam in null case');

                reject([]);

            } else {

                console.log("file duration start : "+file.duration);

                let fileType = file.mimetype.split('/');

                packageModel.addPackageDetail([file.pkgId, file.originalname, fileType[0], file.duration], function(err, rows1) {
                    if (err) reject('error in query');

                    else

                        var dir = `${staticDir}/${name}`;

                    fs.writeFile(`${dir}/${file.originalname}`, file.buffer, (err) => {
                        if (err) throw err;
                        else
                            console.log('The file has been saved!');
                        resolve('inserted data');
                    });


                })
            }

        });

    } catch(e) {

        return failure_callback(res, [e.message, 500]);

    }

}