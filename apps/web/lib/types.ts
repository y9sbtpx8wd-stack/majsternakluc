export type PriceItem = {
  service: string;
  price: string;
};

export type Listing = {
  id: string;
  title: string;                 // názov inzerátu
  description: string;           // predstavenie / popis
  intro?: string;                // krátke intro
  pricePerHour?: string;         // fallback cena
  photos?: string[];             // max 3 fotky
  location?: string;             // lokalita pôsobenia
  experienceYears?: number;      // prax
  skills?: string[];             // zručnosti
  email?: string;
  phone?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  priceList?: PriceItem[];       // cenník
  extraInfo?: string;            // doplnkové info
  isOnline?: boolean;            // dostupnosť
  avatar?: string;               // profilová fotka
  firstName?: string;
  lastName?: string;
};
