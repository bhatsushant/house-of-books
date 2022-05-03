const bookRoutes = require('./books');
const userRoutes = require('./users');
const rentedBookRoutes = require('./library');
const reviewRoutes = require('./reviews');
const genreRoutes = require('./genres');

const constructorMethod = (app) => {
    app.use('/books', bookRoutes);
    app.use('/user', userRoutes);
    app.use('/library', rentedBookRoutes);
    app.use('/review', reviewRoutes);
    app.use('/genres', genreRoutes);

    app.use('*', (req, res) => {
        res.status(404).json('Error: Route not found');
    });
};

module.exports = constructorMethod;
