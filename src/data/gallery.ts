export const galleryData = [
  { src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=700&auto=format&fit=crop", alt: "Family portrait, 1952", tag: "1952 · Portrait", title: "The Lutterodt Household", filter: "photographs" },
  { src: "https://images.unsplash.com/photo-1512635776656-9db3095f2e97?q=80&w=700&auto=format&fit=crop", alt: "Historic ledger document", tag: "1921 · Ledger", title: "Trading House Accounts", filter: "documents" },
  { src: "https://images.unsplash.com/photo-1461783436728-0a9217714694?q=80&w=700&auto=format&fit=crop", alt: "Coastal town archival photo", tag: "1930s · Accra", title: "Harbour Road, Looking East", filter: "homes" },
  { src: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=700&auto=format&fit=crop", alt: "Family celebration", tag: "1986 · Gathering", title: "House Restoration Feast", filter: "events" },
  { src: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=700&auto=format&fit=crop", alt: "Historic family home", tag: "2019 · Homes", title: "Harbour Road House, Restored", filter: "homes" },
  { src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=700&auto=format&fit=crop", alt: "Graduation photo, 1968", tag: "1968 · Portrait", title: "Emmanuel's Graduation", filter: "photographs" },
  { src: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=700&auto=format&fit=crop", alt: "Correspondence letter", tag: "1943 · Letters", title: "Wartime Correspondence", filter: "documents" },
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=700&auto=format&fit=crop", alt: "Diaspora reunion gathering", tag: "2014 · Gathering", title: "London Branch Reunion", filter: "events" },
  { src: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=700&auto=format&fit=crop", alt: "Early 20th century portrait", tag: "1889 · Portrait", title: "Joseph Kwame, Age 30", filter: "photographs" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=700&auto=format&fit=crop", alt: "Restored home interior", tag: "2019 · Interior", title: "The Archive Room", filter: "homes" },
  { src: "https://images.unsplash.com/photo-1461988091159-192b6df7054f?q=80&w=700&auto=format&fit=crop", alt: "Baptismal record scan", tag: "1889 · Records", title: "Baptismal Register Entry", filter: "documents" },
  { src: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=700&auto=format&fit=crop", alt: "Elder portrait", tag: "2021 · Portrait", title: "Auntie Comfort, Interviewed", filter: "photographs" },
] as const;

export const galleryFilters = [
  { key: "all", label: "All" },
  { key: "photographs", label: "Photographs" },
  { key: "events", label: "Family Events" },
  { key: "homes", label: "Historic Homes" },
  { key: "documents", label: "Documents" },
] as const;
