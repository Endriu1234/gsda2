const apiRoutes = require('../../api/routes/apiRoutes');


module.exports.loadRouting = (app, directory) => {

    app.get('/', (req, res) => {
        res.sendFile('app/index.html', { root: directory });
    });

    app.use('/api', apiRoutes);
    app.all('*', function (req, res, next) {
        res.redirect('/');
    });


    app.use((err, req, res, next) => {
        const { statusCode = 500 } = err;

        if (!err.message)
            err.message = 'Something went wrong! Ehh...';

        res.status(statusCode).json({ 'error': err });
    });
}