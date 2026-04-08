/**
 * catchAsync.js
 * 
 * A wrapper for asynchronous Express middleware and controllers.
 * It catches any errors/rejected promises and forwards them to the next() 
 * middleware (global error handler), preventing server crashes.
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = catchAsync;
