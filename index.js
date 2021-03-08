const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalPassport = require('./config/passport-local-strategy');
const ConnectMongo = require('connect-mongo')(session);
const SassMiddleware = require('node-sass-middleware');
const connectFlash = require('connect-flash');
const flashMiddleware = require('./config/middleware');

app.use(SassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix:'/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.set('view engine','ejs');
app.set('views','views');

app.use(session({
    name:'Codeial2',
    secret:'Sonething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new ConnectMongo({
        mongooseConnection: db,
        autoRemove: 'disable'
    })
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.checkAuthtenticatedUser);

app.use(connectFlash());
app.use(flashMiddleware.MWare);

app.use('/',require('./routes'));


app.listen(port,function(err){

    if(err)
    {
        console.log(`Error while running on server: ${err}`);
        return;
    }
    console.log(`Server is running fine on port: ${port}`);
    
}
);