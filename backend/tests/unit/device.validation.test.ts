// backend/tests/unit/device.validation.test.ts
import { AppDataSource } from '../../src/ormconfig'
import { Device, DeviceStatus } from '../../src/entities/Device'

describe('Validação de MAC único', () => {
  const repo = AppDataSource.getRepository(Device)

  beforeEach(async () => {
    await repo.query('DELETE FROM devices')
    await repo.query('ALTER TABLE devices AUTO_INCREMENT = 1')
  })

  it('deve impedir MAC duplicado', async () => {
    const device1 = repo.create({
      name: 'Teste 1',
      mac: 'AA:BB:CC:DD:EE:01',
      status: DeviceStatus.ATIVO,
    })
    await repo.save(device1)

    const device2 = repo.create({
      name: 'Teste 2',
      mac: 'AA:BB:CC:DD:EE:01',
      status: DeviceStatus.ATIVO,
    })

    await expect(repo.save(device2)).rejects.toThrow(/Duplicate entry/)
  })
})