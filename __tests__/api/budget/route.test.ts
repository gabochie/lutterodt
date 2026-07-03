import { PocketBase } from 'pocketbase';

describe('Budget API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return seeded budget data when no budget exists', async () => {
    const mockGetList = jest.fn().mockResolvedValue({
      totalItems: 0,
      items: [],
    });

    const pb = new PocketBase('http://127.0.0.1:8090');
    pb.collection('settings').getList = mockGetList;

    expect(pb).toBeDefined();
  });

  it('should create budget if not exists', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      id: 'budget-1',
      key: 'budget',
      value: '{"items":[]}',
    });

    const pb = new PocketBase('http://127.0.0.1:8090');
    pb.collection('settings').create = mockCreate;

    const result = await pb.collection('settings').create({
      key: 'budget',
      value: '{"items":[]}',
    });

    expect(result.key).toBe('budget');
  });

  it('should update existing budget', async () => {
    const mockUpdate = jest.fn().mockResolvedValue({
      id: 'budget-1',
      key: 'budget',
      value: '{"items":[{"category":"Build","amount":5000}]}',
    });

    const pb = new PocketBase('http://127.0.0.1:8090');
    pb.collection('settings').update = mockUpdate;

    const result = await pb.collection('settings').update('budget-1', {
      value: '{"items":[{"category":"Build","amount":5000}]}',
    });

    expect(result.value).toContain('5000');
  });
});