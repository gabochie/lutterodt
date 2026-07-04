export interface CountryStat {
  name: string;
  count: number;
}

export interface CategoryStat {
  name: string;
  count: number;
}

export const directoryStats = {
  totalProfiles: 77,
  livingProfiles: 69,
  historicalProfiles: 8,
  withConfirmedDOB: 12,
  countries: [
    { name: "Ghana", count: 37 },
    { name: "United Kingdom", count: 12 },
    { name: "United States", count: 10 },
    { name: "Gold Coast", count: 8 },
    { name: "Canada", count: 3 },
    { name: "Germany", count: 2 },
    { name: "China", count: 1 },
    { name: "Denmark", count: 1 },
    { name: "United Arab Emirates", count: 1 },
    { name: "Estonia", count: 1 },
    { name: "Mexico", count: 1 },
  ] as CountryStat[],
  categories: [
    { name: "business", count: 21 },
    { name: "healthcare", count: 12 },
    { name: "engineering", count: 10 },
    { name: "academia", count: 8 },
    { name: "historical", count: 8 },
    { name: "law", count: 7 },
    { name: "creative", count: 7 },
    { name: "service", count: 4 },
  ] as CategoryStat[],
  continents: 6,
  lastUpdated: "2026-07-04",
} as const;
