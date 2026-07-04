import PocketBase from "pocketbase";

jest.mock("pocketbase");

describe("PocketBase Client", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should create PocketBase instance with default URL", () => {
    delete process.env.NEXT_PUBLIC_POCKETBASE_URL;
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
    const pb = new PocketBase(url);
    expect(pb).toBeDefined();
    expect(PocketBase).toHaveBeenCalledWith("http://127.0.0.1:8090");
  });

  it("should create PocketBase instance with env URL when set", () => {
    process.env.NEXT_PUBLIC_POCKETBASE_URL = "http://localhost:8090";
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    const pb = new PocketBase(url);
    expect(pb).toBeDefined();
    expect(PocketBase).toHaveBeenCalledWith("http://localhost:8090");
  });

  it("should handle auth with superuser credentials", async () => {
    process.env.POCKETBASE_SUPERUSER_EMAIL = "admin@test.com";
    process.env.POCKETBASE_SUPERUSER_PASSWORD = "password123";

    const pb = new PocketBase("http://127.0.0.1:8090");
    const auth = await pb.admins.authWithPassword(
      process.env.POCKETBASE_SUPERUSER_EMAIL,
      process.env.POCKETBASE_SUPERUSER_PASSWORD
    );

    expect(pb.admins.authWithPassword).toHaveBeenCalledWith(
      "admin@test.com",
      "password123"
    );
    expect(auth.token).toBe("mock-token");
  });

  it("should use defaults when env vars are missing", async () => {
    delete process.env.POCKETBASE_SUPERUSER_EMAIL;
    delete process.env.POCKETBASE_SUPERUSER_PASSWORD;

    const email = process.env.POCKETBASE_SUPERUSER_EMAIL || "gabochie@gmail.com";
    const password = process.env.POCKETBASE_SUPERUSER_PASSWORD || "AK4QRh369GSYAA";

    const pb = new PocketBase("http://127.0.0.1:8090");
    await pb.admins.authWithPassword(email, password);

    expect(pb.admins.authWithPassword).toHaveBeenCalledWith(
      "gabochie@gmail.com",
      "AK4QRh369GSYAA"
    );
  });
});

describe("PocketBase Collections", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch from articles collection", async () => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const mockGetList = jest.fn().mockResolvedValue({ totalItems: 5 });

    (pb.collection as jest.Mock).mockReturnValue({
      getList: mockGetList,
    });

    const result = await pb.collection("articles").getList(1, 1);
    expect(mockGetList).toHaveBeenCalledWith(1, 1);
    expect(result.totalItems).toBe(5);
  });

  it("should fetch from timeline_events collection", async () => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const mockGetList = jest.fn().mockResolvedValue({ totalItems: 3 });

    (pb.collection as jest.Mock).mockReturnValue({
      getList: mockGetList,
    });

    const result = await pb.collection("timeline_events").getList(1, 1);
    expect(result.totalItems).toBe(3);
  });
});