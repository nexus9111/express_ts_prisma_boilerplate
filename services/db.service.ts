import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';

@Service()
class DBService {
    private client = new PrismaClient();

    public getClient(): PrismaClient {
        return this.client;
    }

    public async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}

const dbService = new DBService();

export { dbService };