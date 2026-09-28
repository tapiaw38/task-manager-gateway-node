import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { describe, it } from 'vitest';

import { createHealthController } from './get';

describe('health controller', () => {
    it('returns the service health', async () => {
        const app = express();
        app.get('/health', createHealthController());

        await request(app)
            .get('/health')
            .expect(StatusCodes.OK)
            .expect({ status: 'ok' });
    });
});
