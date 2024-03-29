const apiRoutes = require('../../api/routes/apiRoutes');


module.exports.loadRouting = (app) => {

    app.get('/', (req, res) => {
        res.send('App not implemented yet');
    });

    app.use('/api', apiRoutes);


    app.use((err, req, res, next) => {
        const { statusCode = 500 } = err;

        if (!err.message)
            err.message = 'Something went wrong! Ehh...';

        res.status(statusCode).json({'error': err });
    });
}