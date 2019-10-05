const path = require('path'),  
    config = require('config');

   const dataDb = require(path.resolve(config.get('app.databaseDir'),'database'));

module.exports = {


    packageDuplicacy: function(data, callback) {

        try {

            let db = dataDb.connectDatabase();
            let query = `SELECT count(*) as total FROM packageMaster WHERE ${data[0]} = '${data[1]}'`;

            db.get(query, [], function(err, row) {

                if (err) {

                    db.close();
                    return callback(null, ['error', 0, 500]);

                } else

                    db.close();
                    return callback(null, ['success', row.total, 200]);

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },


    deletePkgDetail: function(Id, callback) {

        try {

            let db = dataDb.connectDatabase();
            let query = `DELETE FROM packageDetailMaster WHERE pkgId = ${Id}`;

            db.run(query, [], function(err, row) {

                if (err) {

                    db.close();
                    return callback(null, ['error', 500]);

                } else

                    db.close();
                return callback(null, ['success', 200]);

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },


    deleteEntirePackage: function(Id, callback) {

        try {

            let db = dataDb.connectDatabase();
            let query = `DELETE FROM packageMaster WHERE id = ${Id}`;

            db.run(query, [], function(err) {

                if (err) {

                    db.close();
                    return callback(null, ['error', 500]);

                } else

                    db.run(`DELETE FROM packageDetailMaster WHERE pkgId = ?`, [Id], function(err) {

                    if (err) {

                        db.close();
                        return callback(null, ['error', 500]);

                    } else

                        db.close();
                    return callback(null, ['success', 200]);

                })
            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },


    addPackage: function(data, callback) {

        try {

            let query = `INSERT INTO packageMaster (name) VALUES ('${data.packageName}')`;

            console.log(query);

            let db = dataDb.connectDatabase();

            db.run(query, [], function(err, row) {

                if (err) {

                    db.close();
                    return callback(null, ['error', 'error in query', 500]);

                } else
                    db.close();
                return callback(null, ['success', this.lastID, 200]);
            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }


    },

    updatePackage: function(data, callback) {

        try {

            let query = `INSERT INTO packageMaster (name) VALUES ('${data.packageName}')`;

            console.log(query);

            let db = dataDb.connectDatabase();

            db.run(query, [], function(err, row) {

                if (err) {

                    db.close();
                    return callback(null, ['error', 'error in query', 500]);

                } else
                    db.close();
                return callback(null, ['success', this.lastID, 200]);
            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }


    },


    addPackageDetail: function(data, callback) {

        try {

            let query = `INSERT INTO packageDetailMaster (pkgId,file,type,duration) VALUES ('${data[0]}', '${data[1]}', '${data[2]}', '${data[3]}')`;

            let db = dataDb.connectDatabase();

            db.run(query, [], function(err, row) {

                if (err) {

                    db.close();
                    return callback(null, ['error', 'error in query', 500]);

                } else
                    db.close();
                return callback(null, ['success', this.lastID, 200]);
            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },

    updateDuration: function(data, callback) {

        try {

            let query = `UPDATE packageMaster SET duration = '${data[1]}' WHERE id = ${data[0]}`;

            console.log(query);

            let db = dataDb.connectDatabase();

            db.run(query, [], function(err, row) {

                if (err) {

                    db.close();
                    return callback(null, ['error', 'error in query', 500]);

                } else
                    db.close();
                return callback(null, ['success', this.lastID, 200]);
            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },


    getallPackagesList: function(data, callback) {

        try {

            let db = dataDb.connectDatabase();
            let query = `SELECT id,name FROM packageMaster WHERE isActive = 1`;

            db.all(query, [], function(err, row) {

                if (err) {

                    db.close();
                    return callback(null, ['error', 0, 500]);
                } else

                    db.close();
                    return callback(null, ['success', row, 200]);

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },

    getPackageDetail: function(Id, callback) {

        try {

            let db = dataDb.connectDatabase();
            let query = `select p.id, name as package, p.duration as totalDuration, d.file, d.type, d.duration FROM packageMaster p 
                        LEFT JOIN packageDetailMaster d ON d.pkgId = p.id WHERE p.id=${Id}`;

            db.all(query, [], function(err, row) {

                if (err) {

                    console.log(err.message);

                    db.close();
                    return callback(null, ['error', 0, 500]);

                } else
                    db.close();
                   return callback(null, ['success', row, 200]);

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },

    getPackageNameById: function(Id, callback) {

        try {

            let db = dataDb.connectDatabase();
            let query = `select count(*) as total, name FROM packageMaster WHERE id=${Id}`;

            console.log(query);

            db.get(query, [], function(err, row) {

                if (err) {

                    console.log(err.message);

                    db.close();
                    return callback(null, ['error', 0, 500]);

                } else

                if (row.total > 0) {

                    db.close();

                    return callback(null, ['success', row.name, 200]);

                } else {

                    db.close();
                    return callback(null, ['failure', 0, 200]);
                }

            });

        } catch(e) {

            return failure_callback(res, [e.message, 500]);

        }

    },




}