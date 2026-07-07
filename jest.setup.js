jest.mock('@opennextjs/cloudflare', () => ({
  initOpenNextCloudflareForDev: jest.fn(),
  getCloudflareContext: jest.fn().mockReturnValue({
    env: {
      LUTTERODT_KV: {
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
      },
      LUTTERODT_D1: {
        prepare: jest.fn().mockReturnValue({
          bind: jest.fn().mockReturnValue({
            run: jest.fn(),
            first: jest.fn(),
          }),
        }),
        exec: jest.fn(),
      },
    },
    cf: {},
    ctx: { waitUntil: jest.fn() },
  }),
}));
