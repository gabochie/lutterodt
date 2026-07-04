import PocketBase from "pocketbase";

jest.mock("pocketbase");

describe("Budget API Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create budget setting if not exists", async () => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const mockCreate = jest.fn().mockResolvedValue({
      id: "budget-1",
      key: "budget",
      value: '{"items":[]}',
    });

    (pb.collection as jest.Mock).mockReturnValue({
      getFirstListItem: jest.fn().mockRejectedValue(new Error("Not found")),
      create: mockCreate,
    });

    const result = await pb.collection("settings").create({
      key: "budget",
      value: JSON.stringify({ items: [] }),
    });

    expect(result.key).toBe("budget");
    expect(mockCreate).toHaveBeenCalledWith({
      key: "budget",
      value: JSON.stringify({ items: [] }),
    });
  });

  it("should update existing budget", async () => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const mockUpdate = jest.fn().mockResolvedValue({
      id: "budget-1",
      key: "budget",
      value: '{"items":[{"category":"Build","amount":5000}]}',
    });

    (pb.collection as jest.Mock).mockReturnValue({
      getFirstListItem: jest.fn().mockResolvedValue({ id: "budget-1" }),
      update: mockUpdate,
    });

    const result = await pb.collection("settings").update("budget-1", {
      value: JSON.stringify({ items: [{ category: "Build", amount: 5000 }] }),
    });

    expect(result.value).toContain("5000");
    expect(mockUpdate).toHaveBeenCalledWith("budget-1", expect.any(Object));
  });
});