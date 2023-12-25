import request from 'supertest';
import { App } from '../app';
import { defaultUser, getApp, purgeDatabase, testAndAssert } from './utils/test.utils';

afterAll(async () => {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing auth', () => {
    beforeAll(async () => {
        await purgeDatabase();
    });

    afterAll(async () => {
        await purgeDatabase();
    });

    const app = getApp().getServer();
    let token;

    describe('AUTH LOGIC', () => {
        it('create user with bad credentials', async () => {
            let defaultUserCopy = { ...defaultUser };
            delete defaultUserCopy.password;

            await testAndAssert({
                app,
                path: '/users/register',
                body: defaultUserCopy,
                method: 'post',
                expectedStatus: 400,
            });

            defaultUserCopy = { ...defaultUser };
            delete defaultUserCopy.email;

            await testAndAssert({
                app,
                path: '/users/register',
                body: defaultUserCopy,
                method: 'post',
                expectedStatus: 400,
            });

            defaultUserCopy = { ...defaultUser };
            defaultUserCopy.password = "short";

            await testAndAssert({
                app,
                path: '/users/register',
                body: defaultUserCopy,
                method: 'post',
                expectedStatus: 400,
            });

            defaultUserCopy = { ...defaultUser };
            defaultUserCopy.email = "thisisnotanemail";

            await testAndAssert({
                app,
                path: '/users/register',
                body: defaultUserCopy,
                method: 'post',
                expectedStatus: 400,
            });
        });

        it('create valid user', async () => {
            await testAndAssert({
                app,
                path: '/users/register',
                body: defaultUser,
                method: 'post',
                expectedStatus: 201,
            });
        });

        it('create valid user with already existing email', async () => {
            await testAndAssert({
                app,
                path: '/users/register',
                body: defaultUser,
                method: 'post',
                expectedStatus: 409,
            });
        });

        it('login with valid credentials', async () => {
            let resp = await testAndAssert({
                app,
                path: '/users/login',
                body: defaultUser,
                method: 'post',
                expectedStatus: 200,
                expectedCookies: ["Authorization", "Max-Age"],
            });

            token = resp.header['set-cookie'][0].split(";")[0].split("=")[1];
        });

        it('login with invalid credentials', async () => {
            let defaultUserCopy = { ...defaultUser };
            defaultUserCopy.password = "invalidPassword";

            await testAndAssert({
                app,
                path: '/users/login',
                body: defaultUserCopy,
                method: 'post',
                expectedStatus: 409,
            });


            defaultUserCopy = { ...defaultUser };
            defaultUserCopy.email = "foo@mail.com";

            await testAndAssert({
                app,
                path: '/users/login',
                body: defaultUserCopy,
                method: 'post',
                expectedStatus: 409,
            });


            defaultUserCopy = { ...defaultUser };
            defaultUserCopy.email = "thisisnotanemail";

            await testAndAssert({
                app,
                path: '/users/login',
                body: defaultUserCopy,
                method: 'post',
                expectedStatus: 400,
            });
        });

        it('logout with valid credentials', async () => {
            await testAndAssert({
                app,
                path: '/users/logout',
                method: 'get',
                expectedStatus: 204,
                expectedNoToken: true,
                cookies: ["Authorization=" + token],
            });
        });

        it('logout with valid credentials', async () => {
            await testAndAssert({
                app,
                path: '/users/logout',
                method: 'get',
                expectedStatus: 404,
                expectedNoToken: true,
            });
        });
    });
});
