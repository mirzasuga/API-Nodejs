var config = {};

module.exports = function (api, cfg, logger) {
    config = cfg;
    api.use(function (req, res, next) {
        logger.verbose('api access: '+req.url);
        res.contentType = "text/plain";
        next();
    });
};