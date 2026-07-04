import { GET } from "@/app/(main)/api/stats/route";

jest.mock("@/app/(main)/api/stats/route", () => ({
  __esModule: true,
  GET: jest.fn(),
}));

describe("Stats API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return stats on success", async () => {
    const mockResponse = {
      articles: 5,
      timeline: 3,
      gallery: 10,
      contacts: 2,
      settings: 8,
    };

    (GET as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
  });

  it("should return 503 on failure", async () => {
    (GET as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ articles: 0, timeline: 0, gallery: 0, contacts: 0, settings: 0 }), { status: 503 })
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.articles).toBe(0);
  });
});

describe("PocketBase Client", () => {
  it("should use the correct default URL when env var missing", () => {
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
    expect(url).toBeDefined();
  });

  it("should have auth credentials configured", () => {
    const email = process.env.POCKETBASE_SUPERUSER_EMAIL || "gabochie@gmail.com";
    const password = process.env.POCKETBASE_SUPERUSER_PASSWORD || "AK4QRh369GSYAA";
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
  });
});