'use strict'

const express = require('express');
const compression = require('compression');
const serveStatic = require('serve-static')
const engine = require('ejs-mate');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const device = require('express-device');
const session = require('express-session');
const passport = require('passport');
const Datastore = require('@google-cloud/datastore');
const oauth2 = require('./routes/admin/authenticate');
const DatastoreStore = require('@google-cloud/connect-datastore')(session);
const GoogleStrategy = require('passport-google-oauth20').Strategy;



var app = express();

app.use(compression());

app.use(function (req, res, next) {
    res.setTimeout(5000);
    next();
});

// app.use(function (req, res, next) {
//     res.setHeader("Cache-Control", "public, max-age=86400");
//     return next();
// });

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.set('port', (process.env.PORT || 3000));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('trust proxy', true);

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

if (process.env.NODE_ENV === 'production') {
    app.use(function (req, res, next) {
        if (req.secure) {
            next();
        } else {
            res.redirect(301, 'https://' + req.headers.host + req.url);
        }
    });
}

app.use(methodOverride());
app.use(cookieParser());
app.use(device.capture());
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'images')));

var skip = /^\/$|\/favicon.ico|\/javascripts|\/images|\/stylesheets|\/fonts|\/data/;
app.use((req, res, next) => {
    if (!skip.test(req.url)) {
        console.log(`${req.method} : ${req.url}`)
    }
    next()
})

app.use((err, req, res, next) => {
    if (!err) {
        return next();
    }

    if (err.stack) {
        console.error(err.stack);
    }
    else {
        console.error(err);
    }

    res.status(500);
    res.send('500: Internal server error');
});


//=========== authentication ===================
const config = require('./config');
config.GetSettings()
    .then(res => {
        app.use(session({
            resave: false,
            saveUninitialized: false,
            signed: true,
            store: new DatastoreStore({
                dataset: Datastore({
                    prefix: 'express-sessions',
                    projectId: process.env.GCLOUD_PROJECT,
                    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
                })
            }),
            secret: '11 ABC 321459 CRAFT'
        }));

        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.OAUTH2_CLIENT_ID,
                    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
                    callbackURL: process.env.OAUTH2_CALLBACK,
                    accessType: 'offline',
                }, oauth2.AuthenticateUser)
        );

        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user, cb) => {
            cb(null, user);
        });
        passport.deserializeUser((obj, cb) => {
            cb(null, obj);
        });




        app.get('/auth/login', (req, res, next) => {
            if (req.query && req.query.return) {
                req.session.oauth2return = req.query.return;
            }
            next();
        },
            passport.authenticate('google', { scope: ['email', 'profile'] })
        );

        app.get('/auth/google/callback',
            passport.authenticate('google'),
            (req, res) => {
                // const redirect = req.session.oauth2return || '/admin';
                // delete req.session.oauth2return;
                res.redirect("/admin/incomingrequests")
            }
        );

        //============= routes ====================================================
        app.use(function (req, res, next) {
            var err = null;
            try {
                decodeURIComponent(req.path)
            }
            catch (e) {
                console.log("Error reference url: " + err, req.url);
                return res.redirect(global.Host);
            }
            next();
        });

        app.use("/", require("./routes/generalpages"));
        app.use("/admin", oauth2.CheckUser, require("./routes/admin"))

        app.use("/:language/", function (req, res, next) {
            if (!req.params || req.params.language.length > 2) return next()
            else {
                req.language = req.params.language;
                return require("./routes/generalpageslang")(req, res, next)
            }
        })


        const redirects = require("./routes/redirects")
        app.get('*', redirects.GetRedirects)
        //============ end routes =================================================


        http.createServer(app).listen(app.get('port'), function () {
            console.log('Express server listening on port ' + app.get('port'));
        });
    })




//=============== process exceptions ======================================
process.on('uncaughtException', function (error) {
    if (error) {
        console.error("Not cached exception with out stack! : " + error.stack);
    }
    else if (error.stack) {
        console.error(error.stack);
    }
    else {
        console.error(error);
    }
});

process.on('unhandledRejection', function (reason, p) {
    if (reason) {
        console.error("Not handled cached exception with out stack! : " + reason.stack);
    }
    else if (reason.stack) {
        console.error(reason.stack);
    }
    else {
        console.error(reason);
    }
});