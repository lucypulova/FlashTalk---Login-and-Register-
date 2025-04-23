import {NextFunction, Request, Response} from "express";

export default function responseMiddleware(req: Request, res: Response, next: NextFunction) {
    res.sendJson = function <T>(data: T, message = 'OK') {
        // Ако вече има статус, го запази. Ако няма – по подразбиране 200
        const statusCode = this.statusCode !== 200 ? this.statusCode : 200;
        return this.status(statusCode).json({ data, message });
    };    
    next();
}