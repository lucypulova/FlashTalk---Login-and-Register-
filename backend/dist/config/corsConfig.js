"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
exports.default = corsOptions;
