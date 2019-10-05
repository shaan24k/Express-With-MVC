const path = require('path'), 
    config = require('config'),
    sqlite3 = require('sqlite3').verbose();

module.exports = {

    connectDatabase: function(db) {

        if (!db) {

            db = new sqlite3.Database(path.resolve(config.get('db')), sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('database connected successfully.');
            });


        }
        return db;
    }

}