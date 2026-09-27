import type { RequestHandler } from 'express';

export const logging = (): RequestHandler => (request, response, next) => {
    const start = process.hrtime.bigint();
    const { method } = request;
    const [path, query] = request.originalUrl.split('?');

    response.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;

        console.info(
            JSON.stringify({
                level: 'info',
                message: 'http request',
                method,
                path,
                status: response.statusCode,
                duration_ms: Number(durationMs.toFixed(3)),
                ...(query ? { query } : {}),
            }),
        );
    });

    next();
};
