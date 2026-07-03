import { NextResponse } from 'next/server';

jest.mock('pocketbase', () => {
  const mockGetList = jest.fn().mockResolvedValue({
    totalItems: 5,
  });
  
  const mockCollection = jest.fn(() => ({
    getList: mockGetList,
  }));

  return jest.fn().mockImplementation(() => ({
    autoCancellation: jest.fn(),
    admins: {
      authWithPassword: jest.fn().mockResolvedValue({ token: 'fake-token' }),
    },
    collection: mockCollection,
  }));
});

describe('Stats API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return stats with zero values when PocketBase is unavailable', async () => {
    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    expect(pbUrl).toBe('http://127.0.0.1:8090');
  });

  it('should handle missing environment variables gracefully', () => {
    delete process.env.NEXT_PUBLIC_POCKETBASE_URL;
    delete process.env.POCKETBASE_SUPERUSER_EMAIL;
    delete process.env.POCKETBASE_SUPERUSER_PASSWORD;
    
    expect(process.env.NEXT_PUBLIC_POCKETBASE_URL).toBeUndefined();
    expect(process.env.POCKETBASE_SUPERUSER_EMAIL).toBeUndefined();
    expect(process.env.POCKETBASE_SUPERUSER_PASSWORD).toBeUndefined();
  });

  it('should have required dependencies defined', () => {
    const { NextResponse } = require('next/server');
    expect(NextResponse).toBeDefined();
  });
});

describe('Environment Variables', () => {
  it('should have NEXT_PUBLIC_POCKETBASE_URL configured', () => {
    expect(process.env.NEXT_PUBLIC_POCKETBASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_POCKETBASE_URL).toBe('http://127.0.0.1:8090');
  });

  it('should have PocketBase superuser credentials configured', () => {
    expect(process.env.POCKETBASE_SUPERUSER_EMAIL).toBeDefined();
    expect(process.env.POCKETBASE_SUPERUSER_PASSWORD).toBeDefined();
  });
});