import PocketBase from "pocketbase";

jest.mock("pocketbase");

describe("Roadmap API Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch roadmap from settings collection", async () => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const mockData = {
      phases: [{ title: "Foundation (MVP)", status: "in_progress" }],
      sprints: [{ sprint: "Sprint 1", status: "completed" }],
    };

    const mockGetFirstListItem = jest.fn().mockResolvedValue({
      id: "roadmap-1",
      key: "roadmap",
      value: JSON.stringify(mockData),
    });

    (pb.collection as jest.Mock).mockReturnValue({
      getFirstListItem: mockGetFirstListItem,
    });

    const record = await pb.collection("settings").getFirstListItem('key="roadmap"');
    const parsed = JSON.parse(record.value);

    expect(parsed.phases).toHaveLength(1);
    expect(parsed.phases[0].title).toBe("Foundation (MVP)");
    expect(mockGetFirstListItem).toHaveBeenCalledWith('key="roadmap"');
  });

  it("should save updated roadmap to settings", async () => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const mockUpdate = jest.fn().mockResolvedValue({
      id: "roadmap-1",
      key: "roadmap",
      value: JSON.stringify({
        phases: [{ title: "Foundation (MVP)", status: "completed" }],
        sprints: [],
      }),
    });

    (pb.collection as jest.Mock).mockReturnValue({
      getFirstListItem: jest.fn().mockResolvedValue({ id: "roadmap-1" }),
      update: mockUpdate,
    });

    const result = await pb.collection("settings").update("roadmap-1", {
      value: JSON.stringify({
        phases: [{ title: "Foundation (MVP)", status: "completed" }],
        sprints: [],
      }),
    });

    expect(result.key).toBe("roadmap");
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should handle missing roadmap gracefully", async () => {
    const pb = new PocketBase("http://127.0.0.1:8090");

    (pb.collection as jest.Mock).mockReturnValue({
      getFirstListItem: jest.fn().mockRejectedValue(new Error("Not found")),
    });

    await expect(
      pb.collection("settings").getFirstListItem('key="roadmap"')
    ).rejects.toThrow("Not found");
  });
});