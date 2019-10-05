const path       = require('path'),
      cors       = require('cors'),
      express    = require('express'),
      xss        = require('xss-clean'),
      config     = require('config'),
      bodyParser = require('body-parser'),
      router     = require(path.resolve(config.get("app.routeDir"),'route')),
      app        = express(); 

    console.log('Version: ' + process.version);

    const PORT = config.get("port");

    app.use(xss());
    app.use(cors());
    app.use(express.json());
    app.use('/api',router);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use('data',express.static(path.join(__dirname, 'public')));


    app.listen(PORT || 9000, () => {
        console.log('app listening on port ' + PORT || 9000)
    });


    //error handlers
    app.use(function(req, res, next) {
        res.status(404).json({ error: 1, message: 'No route found!' });
    });
    
    app.use(function(req, res, next) {
        res.status(500).json({ error: 1, message: 'Internal server error!' });
    });
    