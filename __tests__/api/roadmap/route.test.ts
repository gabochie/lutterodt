import { PocketBase } from 'pocketbase';

describe('Roadmap API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial roadmap when no data exists', async () => {
    jest.spyOn(PocketBase.prototype, 'collection').mockReturnThis();
    const pb = new PocketBase('http://127.0.0.1:8090');
    
    const mockGetList = jest.fn().mockResolvedValue({
      totalItems: 5,
    });
    pb.collection('roadmap').getList = mockGetList;

    const response = await fetch('/api/roadmap');
    const data = await response.json();

    expect(data).toEqual(initialRoadmap);
  });

  it('should update roadmap when data is sent', async () => {
    const mockGetList = jest.fn().mockResolvedValue({
      totalItems: 8,
    });

    const newRoadmap = {
      phases: [{
        items: [{
          status: 'completed',
        }]
      }]
    };

    pocketBase.setup('http://127.0.0.1:8090');
    const pb = new PocketBase('http://127.0.0.1:8090');
    pb.collection('roadmap').put = jest.fn().mockResolvedValue(newRoadmap);

    const response = await fetch('/api/roadmap', {
      method: 'POST',
      body: JSON.stringify(newRoadmap),
    });
    const updatedData = await response.json();

    expect(updatedData).toEqual(newRoadmap);
  });
});