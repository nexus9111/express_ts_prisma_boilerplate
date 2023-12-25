import request from 'supertest';
import { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import { App } from '../../app';
import { UserRoute } from '../../router/user.route';

interface testAndAssertProps {
    app: Application,
    path: string,
    headers?: { key: string, value: string }[],
    method: 'get' | 'post' | 'put' | 'delete',
    body?: any,
    cookies?: string[],
    expectedStatus?: number,
    expectedBody?: { key: string, value: any }[],
    expectedBodyExists?: { key: string }[],
    expectedHeaders?: { key: string, value: any }[],
    expectedCookies?: string[],
    expectedNoToken?: boolean,
}

export const testAndAssert = async ({
    app,
    path,
    headers = [],
    method,
    body,
    cookies = [],
    expectedStatus = -1,
    expectedBody = [],
    expectedBodyExists = [],
    expectedHeaders = [],
    expectedCookies = [],
    expectedNoToken = false,
}: testAndAssertProps) => {

    let response;
    switch (method) {
        case 'get':
            response = await request(app).get(path).set(headers).set('Cookie', cookies)
            break;
        case 'post':
            response = await request(app).post(path).set(headers).set('Cookie', cookies).send(body)
            break;
        case 'put':
            response = await request(app).put(path).set(headers).set('Cookie', cookies).send(body)
            break;
        case 'delete':
            response = await request(app).delete(path).set('Cookie', cookies).set(headers)
            break;
        default:
            expect(false).toBe(true)
    }

    if (expectedStatus > 0) {
        expect(response.statusCode).toBe(expectedStatus)
    }

    for (const header of expectedHeaders) {
        expect(response.header[header.key]).toBe(header.value)
    }

    for (const cookie of expectedCookies) {
        expect(response.header['set-cookie'][0]).toContain(cookie)
    }

    for (const body of expectedBody) {
        expect(response.body[body.key]).toBe(body.value)
    }

    for (const body of expectedBodyExists) {
        expect(response.body[body.key]).toBeDefined()
    }

    if (expectedNoToken) {
        if (response.header['set-cookie'] === undefined) {
            expect(true).toBe(true)
            return response;
        }

        expect(response.header['set-cookie'][0]).toContain("Max-age=0")
        expect(response.header['set-cookie'][0]).toContain("Authorization=;")
    }

    return response;
}

export const purgeDatabase = async () => {
    const prisma = new PrismaClient();
    await prisma.user.deleteMany();
}

export const getApp = () => {
    const app = new App([new UserRoute()])
    return app
}

export const defaultUser = {
    "email": "mail@mail.mail",
    "password": "P@ssw0rd!!"
}