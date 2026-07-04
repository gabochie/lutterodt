jest.mock('pocketbase', () => {
  const mockGetList = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockGetFirstListItem = jest.fn();
  const mockAuthWithPassword = jest.fn().mockResolvedValue({ token: 'mock-token' });

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      autoCancellation: jest.fn(),
      authStore: {
        save: jest.fn(),
        isValid: false,
        clear: jest.fn(),
        loadFromCookie: jest.fn(),
      },
      admins: {
        authWithPassword: mockAuthWithPassword,
      },
      collection: jest.fn().mockReturnValue({
        getList: mockGetList,
        getFirstListItem: mockGetFirstListItem,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      }),
    })),
  };
});

jest.mock('@opennextjs/cloudflare', () => ({
  initOpenNextCloudflareForDev: jest.fn(),
}));