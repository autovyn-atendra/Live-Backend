const { createLogger, format, transports } = require('winston');
const morgan = require('morgan');
// Define your logger
const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/server.log' }), // Save logs to a file
        new transports.Console() // Output logs to the console as well
    ]
});

const requestLogger = morgan((tokens, req, res) => {
    return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        content_length: tokens.res(req, res, 'content-length'),
        response_time: tokens['response-time'](req, res) + ' ms',
        headers: req.headers,
        body: req.body
    });
}, {
    stream: {
        write: (message) => logger.info(message.trim()) // Log request details
    }
});

// Middleware to log response data
const responseLogger = (req, res, next) => {
    const oldSend = res.send;
    res.send = function (data) {
        logger.info(`Response: ${data}`);
        oldSend.apply(res, arguments); // Call the original `res.send`
    };
    next();
};

// Middleware to log errors
const errorLogger = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        headers: req.headers,
        body: req.body
    });
    res.status(500).send('An error occurred.');
};


module.exports = { requestLogger, responseLogger, errorLogger };
