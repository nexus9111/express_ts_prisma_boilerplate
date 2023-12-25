import request from 'supertest';
import { App } from '../app';
import { getApp, purgeDatabase, testAndAssert } from './utils/test.utils';

afterAll(async () => {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Index', () => {
    beforeAll(async () => {
        await purgeDatabase();
    });

    afterAll(async () => {
        await purgeDatabase();
    });

    const app = getApp().getServer();
    describe('[GET] /', () => {
        it('response statusCode 200', async () => {
            await testAndAssert({
                app,
                path: '/',
                method: 'get',
                expectedStatus: 200,
            });
        });
        it('response contains message', async () => {
            await testAndAssert({
                app,
                path: '/',
                method: 'get',
                expectedBodyExists: [
                    { key: 'message' },
                ],
            });
        });
    });
});
