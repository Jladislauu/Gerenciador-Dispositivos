// tests/setup.ts
import { AppDataSource } from "../ormconfig";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE \`${entity.tableName}\` RESTART IDENTITY CASCADE;`);
  }
});