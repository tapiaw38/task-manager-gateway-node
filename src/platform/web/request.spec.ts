import type { Request } from 'express';
import { describe, expect, it } from 'vitest';

import { ApplicationError } from '../errors/applicationError';
import { errors } from '../errors/mappings';
import {
    parseCompletePayload,
    parseTaskPayload,
    pathParameter,
    queryString,
} from './request';

describe('queryString', () => {
    it.for([
        { value: 'tasks', expected: 'tasks' },
        { value: ['tasks'], expected: '' },
        { value: undefined, expected: '' },
    ])('reads string query value', ({ value, expected }) => {
        expect(queryString(value)).toBe(expected);
    });
});

describe('pathParameter', () => {
    it('reads a string path parameter', () => {
        const request = { params: { id: 'task-1' } } as unknown as Request;

        expect(pathParameter(request, 'id')).toBe('task-1');
    });
});

describe('parseTaskPayload', () => {
    it.for([null, [], 'task', 1])(
        'rejects invalid payload containers',
        (body) => {
            expect(() => parseTaskPayload(body)).toThrow(ApplicationError);

            try {
                parseTaskPayload(body);
            } catch (error) {
                expect((error as ApplicationError).code).toBe(
                    errors.invalidRequestBody.code,
                );
            }
        },
    );

    it.for([
        { title: 1, description: 'Description' },
        { title: 'Title', description: {} },
    ])('rejects non-string task fields', (body) => {
        expect(() => parseTaskPayload(body)).toThrow(ApplicationError);
    });

    it('maps missing task fields to empty strings', () => {
        expect(parseTaskPayload({})).toEqual({ title: '', description: '' });
    });
});

describe('parseCompletePayload', () => {
    it.for([{ completed: 'true' }, { completed: 1 }, {}])(
        'rejects a non-boolean completed flag',
        (body) => {
            expect(() => parseCompletePayload(body)).toThrow(ApplicationError);
        },
    );

    it.for([
        { completed: true, expected: true },
        { completed: false, expected: false },
    ])('reads the completed flag', ({ completed, expected }) => {
        expect(parseCompletePayload({ completed })).toEqual({
            completed: expected,
        });
    });
});
