export interface FamousLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  region: string;
  keywords: string[];
}

export const FAMOUS_LOCATIONS: FamousLocation[] = [
  {
    name: 'Sahara Desert',
    lat: 23.4162,
    lon: 25.6628,
    country: 'Africa',
    region: 'Central Sahara',
    keywords: ['sahara', 'desert', 'sahara desert']
  },
  {
    name: 'Mount Everest',
    lat: 27.9881,
    lon: 86.9250,
    country: 'Nepal',
    region: 'Himalayas',
    keywords: ['everest', 'mount everest', 'himalaya']
  },
  {
    name: 'Antarctica',
    lat: -75.2509,
    lon: 0.0713,
    country: 'Antarctica',
    region: 'South Pole Region',
    keywords: ['antarctica', 'south pole', 'antarctic']
  },
  {
    name: 'Death Valley',
    lat: 36.5323,
    lon: -116.9325,
    country: 'United States',
    region: 'California',
    keywords: ['death valley', 'california desert']
  },
  {
    name: 'Amazon Rainforest',
    lat: -3.4653,
    lon: -62.2159,
    country: 'Brazil',
    region: 'Amazon Basin',
    keywords: ['amazon', 'rainforest', 'amazon rainforest', 'amazon jungle']
  },
  {
    name: 'Gobi Desert',
    lat: 42.5888,
    lon: 103.5281,
    country: 'Mongolia',
    region: 'Central Asia',
    keywords: ['gobi', 'gobi desert', 'mongolia desert']
  },
  {
    name: 'Australian Outback',
    lat: -25.2744,
    lon: 133.7751,
    country: 'Australia',
    region: 'Central Australia',
    keywords: ['outback', 'australian outback', 'uluru', 'ayers rock']
  },
  {
    name: 'Atacama Desert',
    lat: -23.6980,
    lon: -69.4781,
    country: 'Chile',
    region: 'Northern Chile',
    keywords: ['atacama', 'atacama desert', 'chile desert']
  },
  {
    name: 'K2 Mountain',
    lat: 35.8825,
    lon: 76.5133,
    country: 'Pakistan',
    region: 'Karakoram Range',
    keywords: ['k2', 'karakoram', 'savage mountain']
  },
  {
    name: 'North Pole',
    lat: 90.0000,
    lon: 0.0000,
    country: 'Arctic Ocean',
    region: 'Arctic',
    keywords: ['north pole', 'arctic', 'arctic ocean']
  },
  {
    name: 'Denali',
    lat: 63.0692,
    lon: -151.0070,
    country: 'United States',
    region: 'Alaska',
    keywords: ['denali', 'mount mckinley', 'alaska']
  },
  {
    name: 'Kilimanjaro',
    lat: -3.0674,
    lon: 37.3556,
    country: 'Tanzania',
    region: 'East Africa',
    keywords: ['kilimanjaro', 'mount kilimanjaro', 'tanzania']
  },
  {
    name: 'Grand Canyon',
    lat: 36.0544,
    lon: -112.1401,
    country: 'United States',
    region: 'Arizona',
    keywords: ['grand canyon', 'arizona canyon']
  },
  {
    name: 'Patagonia',
    lat: -41.8102,
    lon: -68.9063,
    country: 'Argentina',
    region: 'Southern Argentina',
    keywords: ['patagonia', 'argentina patagonia', 'tierra del fuego']
  },
  {
    name: 'Siberia',
    lat: 60.0000,
    lon: 105.0000,
    country: 'Russia',
    region: 'Northern Russia',
    keywords: ['siberia', 'siberian', 'russia siberia']
  },
  {
    name: 'Greenland Ice Sheet',
    lat: 72.0000,
    lon: -40.0000,
    country: 'Greenland',
    region: 'Greenland',
    keywords: ['greenland', 'ice sheet', 'greenland ice']
  },
  {
    name: 'Mojave Desert',
    lat: 35.0456,
    lon: -115.4734,
    country: 'United States',
    region: 'California/Nevada',
    keywords: ['mojave', 'mojave desert', 'las vegas desert']
  },
  {
    name: 'Kalahari Desert',
    lat: -24.5000,
    lon: 21.0000,
    country: 'Botswana',
    region: 'Southern Africa',
    keywords: ['kalahari', 'kalahari desert', 'botswana desert']
  },
  {
    name: 'Iceland Highlands',
    lat: 64.9631,
    lon: -19.0208,
    country: 'Iceland',
    region: 'Central Iceland',
    keywords: ['iceland', 'iceland highlands', 'reykjavik']
  },
  {
    name: 'Namib Desert',
    lat: -24.7603,
    lon: 15.3705,
    country: 'Namibia',
    region: 'Southwestern Africa',
    keywords: ['namib', 'namib desert', 'namibia desert']
  }
];

export function searchFamousLocations(query: string): FamousLocation[] {
  const searchTerm = query.toLowerCase().trim();

  return FAMOUS_LOCATIONS.filter(location =>
    location.keywords.some(keyword =>
      keyword.includes(searchTerm) || searchTerm.includes(keyword)
    )
  );
}
