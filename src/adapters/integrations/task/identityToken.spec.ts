import { afterEach, describe, expect, it, vi } from 'vitest';

import { getIdentityToken } from './identityToken';

describe('getIdentityToken', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('requests an identity token for the target audience', async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response('token'));
        vi.stubGlobal('fetch', fetchMock);

        await expect(
            getIdentityToken('https://task-service.run.app'),
        ).resolves.toBe('token');

        expect(String(fetchMock.mock.calls[0][0])).toContain(
            'audience=https%3A%2F%2Ftask-service.run.app',
        );
        expect(fetchMock.mock.calls[0][1]).toEqual({
            headers: { 'Metadata-Flavor': 'Google' },
        });
    });

    it('rejects an unavailable metadata service response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
        );

        await expect(
            getIdentityToken('https://task-service.run.app'),
        ).rejects.toThrow('could not obtain task service identity token');
    });
});
