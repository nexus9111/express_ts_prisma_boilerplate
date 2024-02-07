import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class DBService {
    private client = new PrismaClient();

    public getClient(): PrismaClient {
        return this.client;
    }
}