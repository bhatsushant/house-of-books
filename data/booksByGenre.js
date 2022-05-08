const mongoCollections = require('../config/mongoCollection');
const books = mongoCollections.books;
const { ObjectId } = require('mongodb');

const getAllBooksByGenre = async () => {
    try {
        const booksColl = await books();
        // const booksGenre = await booksColl.findOne({'genre':});
    } catch (error) {
        throwCatchError(error);
    }
};
const throwError = (code = 404, message = 'Not found') => {
    throw { code, message };
};
const throwCatchError = (error) => {
    if (error.code && error.message) {
        throwError(error.code, error.message);
    }

    throwError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'Error: Internal server error.'
    );
};
