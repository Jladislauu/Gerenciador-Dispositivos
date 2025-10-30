// backend/tests/setup.ts
import { AppDataSource } from '../src/ormconfig'

beforeAll(async () => {
  await AppDataSource.initialize()
})

afterAll(async () => {
  await AppDataSource.destroy()
})

beforeEach(async () => {
  const entities = AppDataSource.entityMetadatas
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name)
    // MySQL: TRUNCATE com RESTART IDENTITY não existe → usamos DELETE + ALTER TABLE
    await repository.query(`DELETE FROM \`${entity.tableName}\``)
    await repository.query(`ALTER TABLE \`${entity.tableName}\` AUTO_INCREMENT = 1`)
  }
})