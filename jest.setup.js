const { jest } = require('@jest/globals');

jest.mock('pocketbase', () => {
  class MockPocketBase {
    constructor() {}
    autoCancellation() {}
    admins() { return { authWithPassword } }
    collection(name) { return { getList } }
  }
  
  const mockpb = new MockPocketBase();
  
  return {
    PocketBase: jest.fn(() => mockpb),
  };
});

jest.mock('node:fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

jest.mock('node:path', () => ({
  join: jest.fn(),
  resolve: jest.fn(),
}));

jest.mock('node:os', () => ({
  platform: () => 'linux',
  arch: () => 'x64',
}));

jest.mock('@opennextjs/cloudflare', () => {
  return {
    initOpenNextCloudflareForDev: jest.fn(),
  };
});