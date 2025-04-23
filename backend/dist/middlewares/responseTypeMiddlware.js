"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = responseMiddleware;
function responseMiddleware(req, res, next) {
    res.sendJson = function (data, message = 'OK') {
        // Ако вече има статус, го запази. Ако няма – по подразбиране 200
        const statusCode = this.statusCode !== 200 ? this.statusCode : 200;
        return this.status(statusCode).json({ data, message });
    };
    next();
}
