const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(flash());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.all('/', function (req, res, next) {
    req.app.locals.layout = 'main'; // set your layout here
    next(); // pass control to the next handler
});

app.all('/admin/*', function (req, res, next) {
    req.app.locals.layout = 'dashboard'; // set your layout here
    next(); // pass control to the next handler
});





var hbs = exphbs.create({
    defaultLayout: 'main',

    partialsDir: [
        'views/admin/partials/',
        'views/front/partials/',
    ]
});

// view engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// app.enable('view cache');

app.use('/admin/assets', express.static('./node_modules/admin-lte'));

// admin routes
const dashboardRouter = require('./routes/admin/dashboard');

app.use('/admin', dashboardRouter);

// front routes
const mainRouter = require('./routes/main');

app.use('/', mainRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    // set locals, only providing error in development
    res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page

    res.render('error');


});


mongoose.connect('mongodb://localhost:27017/eraya',{ useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('mongodb started.');
        app.listen(PORT, () => {
            console.log(`Server started on ${PORT}`);
        });
    }).catch(() => {
    console.log('Mongodb connection failed.');
})