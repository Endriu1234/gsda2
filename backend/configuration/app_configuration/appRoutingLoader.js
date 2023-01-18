const apiRoutes = require('../../api/routes/apiRoutes');


module.exports.loadRouting = (app) => {

    app.get('/', (req, res) => {
        res.send('App not implemented yet');
    });

    app.use('/api', apiRoutes);


    app.use((err, req, res, next) => {
        console.log('poszlo 500');
        const { statusCode = 500 } = err;

        if (!err.message)
            err.message = 'Something went wrong! Ehh...';

        res.status(statusCode).render('error', { err });
    });
}