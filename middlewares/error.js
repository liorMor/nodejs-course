const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.log(err);


    //mongoose bad obj id
    if (err.name === 'CastError') {
        const message = `Resource not foundY
        `;
        error = new ErrorResponse(message, 404);
    }
    //mongoose dup key
    if (err.code === 11000) {
        const message = 'Duplicated field value entered';
        error = new ErrorResponse(message, 400);
    }
    //mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({ 
        success: false, 
        error: error.message || 'Server Error' 
    });
}

module.exports = errorHandler;