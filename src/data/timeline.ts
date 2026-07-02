export const timelineData = [
  {
    year: "1847",
    category: "Rec. 1847–002",
    title: "The First Landing",
    description: "Shipping ledgers and parish baptismal records place the earliest documented Lutterodt on the Gold Coast, working the harbour trade routes between Accra and Elmina.",
    filter: "businesses",
    images: [
      { src: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=400&auto=format&fit=crop", alt: "Historic harbour, archival image" },
      { src: "https://images.unsplash.com/photo-1461988091159-192b6df7054f?q=80&w=400&auto=format&fit=crop", alt: "Ledger document scan" },
    ],
  },
  {
    year: "1889",
    category: "Rec. 1889–007",
    title: "Birth of Joseph Kwame Lutterodt",
    description: "The first family member whose birth was formally registered by the colonial administration — a record that anchors five subsequent generations of genealogy.",
    filter: "births",
  },
  {
    year: "1921",
    category: "Rec. 1921–014",
    title: "The Trading House Opens",
    description: "Joseph Kwame founds the family's first commercial venture on Harbour Road, dealing in textiles and dry goods — the beginning of three generations in trade.",
    filter: "businesses",
    images: [
      { src: "https://images.unsplash.com/photo-1519925610903-381054cc2a1c?q=80&w=400&auto=format&fit=crop", alt: "Storefront archival image" },
    ],
  },
  {
    year: "1943",
    category: "Rec. 1943–021",
    title: "Wartime Rationing Committee",
    description: "Comfort Adjoa Lutterodt is appointed to the district rationing board, one of the first women in the family's record to hold formal public office.",
    filter: "public-service",
  },
  {
    year: "1968",
    category: "Rec. 1968–031",
    title: "First of the Family to Read Law",
    description: "Emmanuel Tetteh Lutterodt graduates from law school abroad and returns to practice in Accra, opening the professions to three subsequent generations.",
    filter: "education",
    images: [
      { src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400&auto=format&fit=crop", alt: "Graduation archival photo" },
    ],
  },
  {
    year: "1982",
    category: "Rec. 1982–040",
    title: "Appointment to National Planning Commission",
    description: "Grace Naa Lutterodt is appointed to a national infrastructure planning role, the family's first contribution at that level of national service.",
    filter: "national",
  },
  {
    year: "1986",
    category: "Rec. 1986–044",
    title: "Harbour Road House Restored",
    description: "The original family home is restored after storm damage and formally designated as the site of all future family gatherings.",
    filter: "achievements",
  },
  {
    year: "1994",
    category: "Rec. 1994–051",
    title: "The London Branch Begins",
    description: "The first Lutterodt household is established outside Ghana, marking the start of the family's diaspora branch.",
    filter: "births",
  },
  {
    year: "2019",
    category: "Rec. 2019–066",
    title: "Harbour Road House Restored, Again",
    description: "A second restoration modernises the family home while preserving its original rooms — several of which now house the physical archive.",
    filter: "achievements",
    images: [
      { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop", alt: "Restored home interior" },
    ],
  },
  {
    year: "2026",
    category: "Rec. 2026–001",
    title: "The Renaissance Archive Launches",
    description: "The family's complete documented history is digitised and made publicly accessible for the first time, with this platform as its permanent home.",
    filter: "achievements",
  },
];

export const timelineFilters = [
  { key: "all", label: "All Records" },
  { key: "births", label: "Births" },
  { key: "achievements", label: "Achievements" },
  { key: "businesses", label: "Businesses" },
  { key: "public-service", label: "Public Service" },
  { key: "education", label: "Education" },
  { key: "national", label: "National Contributions" },
] as const;
