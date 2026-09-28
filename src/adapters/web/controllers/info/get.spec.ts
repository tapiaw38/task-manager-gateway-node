import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { describe, it } from 'vitest';

import { createInfoController } from './get';
import type { Configuration } from '../../../../platform/config/config';

describe('info controller', () => {
    it('returns application metadata', async () => {
        const app = express();
        const configuration = {
            appName: 'Task Manager Gateway',
            appVersion: '1.0.0',
        } as Configuration;
        app.get('/api/info', createInfoController(configuration));

        await request(app).get('/api/info').expect(StatusCodes.OK).expect({
            application: 'Task Manager Gateway',
            version: '1.0.0',
        });
    });
});
