// No imports needed for public assets! Direct path string references:

export const EXHIBITS = [
  { 
    id: '01', 
    title: 'Mr. Champions League', 
    image: '/assets/museum/Cr7_kyiv_five_trophies_1792097274769.jpg', 
    focalY: 20 
  },
  { 
    id: '02', 
    title: "5x Ballon d'Or Dynasty", 
    image: '/assets/museum/la_decima_flex_1792094860767.jpg', 
    focalY: 30 
  },
  { 
    id: '03', 
    title: 'Paris 2016 (Euro Glory)', 
    image: '/assets/museum/euro_trophy_kiss_1792092651669.jpg', 
    focalY: 15  // <-- Lowered to shift image down and keep head/hair fully in view
  },
  { 
    id: '04', 
    title: 'Official Archival Vault — Moscow 2008', 
    image: '/assets/museum/moscow_header_1792091966560.jpg', 
    focalY: 40 
  },
  { 
    id: '05', 
    title: 'Real Madrid Apex Era', 
    image: '/assets/museum/el_bicho_three_peat_1792093786564.jpg', 
    focalY: 20  // <-- Lowered to shift image down
  },
  { 
    id: '06', 
    title: 'International Cap Record', 
    image: '/assets/museum/juve_atletico_hattrick_1792093077787.jpg', 
    focalY: 25  // <-- Lowered to shift image down
  }
];

export interface ExhibitConfigItem {
  id: string;
  title: string;
  image: string;
  focalY: number;
  hasImage?: boolean;
}

export const EXHIBITS_CONFIG: ExhibitConfigItem[] = EXHIBITS.map(ex => ({
  ...ex,
  hasImage: true
}));

export const exhibit1Img = EXHIBITS[0].image;
export const exhibit2Img = EXHIBITS[1].image;
export const exhibit3Img = EXHIBITS[2].image;
export const exhibit4Img = EXHIBITS[3].image;
export const exhibit5Img = EXHIBITS[4].image;
export const exhibit6Img = EXHIBITS[5].image;

export const exhibit01Pic = exhibit1Img;
export const exhibit02Pic = exhibit2Img;
export const exhibit03Pic = exhibit3Img;
export const exhibit04Pic = exhibit4Img;
export const exhibit05Pic = exhibit5Img;
export const exhibit06Pic = exhibit6Img;
