// Explicit ES module imports for all 6 exhibits
import exhibit1Img from './assets/images/input_file_0.png';
import exhibit2Img from './assets/images/la_decima_flex_1792094860767.jpg';
import exhibit3Img from './assets/images/euro_trophy_kiss_1792092651669.jpg';
import exhibit4Img from './assets/images/moscow_header_1792091966560.jpg'; // Moscow 2008 header for Exhibit 04
import exhibit5Img from './assets/images/el_bicho_three_peat_1792093786564.jpg';
import exhibit6Img from './assets/images/juve_atletico_hattrick_1792093077787.jpg';

// Complete Exhibit Configuration Array (Exhibits 01 - 06)
export const EXHIBITS = [
  { 
    id: '01', 
    title: 'Mr. Champions League', 
    image: exhibit1Img, 
    focalY: 20 
  },
  { 
    id: '02', 
    title: "5x Ballon d'Or Dynasty", 
    image: exhibit2Img, 
    focalY: 30 
  },
  { 
    id: '03', 
    title: 'Paris 2016 (Euro Glory)', 
    image: exhibit3Img, 
    focalY: 25 
  },
  { 
    id: '04', 
    title: 'Official Archival Vault — Moscow 2008', 
    image: exhibit4Img, 
    focalY: 40 
  },
  { 
    id: '05', 
    title: 'Real Madrid Apex Era', 
    image: exhibit5Img, 
    focalY: 35 
  },
  { 
    id: '06', 
    title: 'International Cap Record', 
    image: exhibit6Img, 
    focalY: 40 
  }
];

export interface ExhibitConfigItem {
  id: string;
  title: string;
  image: string | null;
  focalY?: number;
  hasImage: boolean;
}

export const EXHIBITS_CONFIG: ExhibitConfigItem[] = [
  {
    id: '01',
    title: 'Mr. Champions League',
    image: exhibit1Img,
    focalY: 20, // Vertical focal point for outside preview crop
    hasImage: true
  },
  {
    id: '02',
    title: "5x Ballon d'Or Dynasty",
    image: exhibit2Img,
    focalY: 30,
    hasImage: true
  },
  {
    id: '03',
    title: 'Paris 2016 (Euro Glory)',
    image: exhibit3Img,
    focalY: 25,
    hasImage: true
  },
  {
    id: '04',
    title: 'Official Archival Vault — Moscow 2008',
    image: exhibit4Img,
    focalY: 40,
    hasImage: true
  },
  {
    id: '05',
    title: 'Real Madrid Apex Era',
    image: exhibit5Img,
    focalY: 35,
    hasImage: true
  },
  {
    id: '06',
    title: 'International Cap Record Holder',
    image: exhibit6Img,
    focalY: 40,
    hasImage: true
  }
];

export const exhibit01Pic = exhibit1Img;
export const exhibit02Pic = exhibit2Img;
export const exhibit03Pic = exhibit3Img;
export const exhibit04Pic = exhibit4Img;
export const exhibit05Pic = exhibit5Img;
export const exhibit06Pic = exhibit6Img;

export {
  exhibit1Img,
  exhibit2Img,
  exhibit3Img,
  exhibit4Img,
  exhibit5Img,
  exhibit6Img,
};
