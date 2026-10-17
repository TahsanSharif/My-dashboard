import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, Sparkles, Check, ChevronDown, ChevronUp, Landmark, Shirt, X, Award, Medal, Flame } from 'lucide-react';
import { GoatPreset } from '../types';
import { EuropeanNightsPavilion } from './EuropeanNightsPavilion';
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

export const exhibit1Img = EXHIBITS[0].image;
export const exhibit2Img = EXHIBITS[1].image;
export const exhibit3Img = EXHIBITS[2].image;
export const exhibit4Img = EXHIBITS[3].image;
export const exhibit5Img = EXHIBITS[4].image;
export const exhibit6Img = EXHIBITS[5].image;

const exhibit01Pic = EXHIBITS[0].image;
const exhibit02Pic = EXHIBITS[1].image;
const exhibit03Pic = EXHIBITS[2].image;
const exhibit04Pic = EXHIBITS[3].image;
const exhibit05Pic = EXHIBITS[4].image;
const exhibit06Pic = EXHIBITS[5].image;

export interface JerseyPresetConfig {
  id: GoatPreset;
  name: string;
  sublabel: string;
  clubYear: string;
  tag: string;
  bgHex: string;
  accentHex: string;
  goldHex: string;
  badgeHex: string;
  jerseyPattern: string;
  description: string;
}

export interface FinalNarrative {
  year: string;
  dateLocation: string;
  match: string;
  narrative: string;
  stats: string;
}

export interface ThreePeatEraStats {
  title: string;
  totalGoals: number;
  totalAppearances: number;
  totalAssists: number;
  uclTitles: string;
  topScorerStreak: string;
  goalsPerApp: number;
  uclFinalsGoals: string;
  finalsWon: string;
  seasonGoalBreakdown: string;
}

export interface JuventusSeasonStats {
  allCompetitions: {
    appearances: number;
    goals: number;
    assists: number;
    goalContributions: number;
  };
  championsLeague: {
    appearances: number;
    goals: number;
    assists: number;
    goalContributions: number;
  };
}

export interface SeasonStats201314 {
  allCompetitions: {
    appearances: number;
    goals: number;
    assists: number;
    goalContributions: number;
    trophies: string[];
  };
  championsLeague: {
    appearances: number;
    goals: number;
    assists: number;
    goalContributions: number;
    achievement: string;
  };
}

export interface MuseumExhibit {
  id: GoatPreset;
  exhibitNumber: string;
  title: string;
  clubEra: string;
  matchDate: string;
  photoAsset: string;
  narrative: string;
  statsSummary: string;
  finals?: FinalNarrative[];
  threePeatEraStats?: ThreePeatEraStats;
  seasonStats201314?: SeasonStats201314;
  juventusSeasonStats?: JuventusSeasonStats;
  euroRecords?: string[];
  individualAwards?: string[];
  teamTrophies?: string[];
  image?: string | null;
  focalY?: number;
  hasImage?: boolean;
}

export const GOAT_PRESETS: JerseyPresetConfig[] = [
  {
    id: 'mr-champions-league',
    name: 'The European Nights',
    sublabel: 'UEFA Champions League · CR7',
    clubYear: 'Knockout Stage · All-Time UCL Top Scorer',
    tag: 'PRESET 1',
    bgHex: '#06152E',
    accentHex: '#0757C8',
    goldHex: '#D4AF37',
    badgeHex: '#45B7FF',
    jerseyPattern: 'linear-gradient(135deg, #06152E 0%, #0757C8 60%, #45B7FF 100%)',
    description: 'Midnight stadium blue, starlight silver, starball cyan & legacy gold floodlights.',
  },
  {
    id: 'galactico-gold',
    name: 'Galáctico Gold',
    sublabel: 'Real Madrid Era',
    clubYear: '450 Goals · 4 UCL · 4 Ballon d’Or',
    tag: 'PRESET 2',
    bgHex: '#0E131F',
    accentHex: '#D5B46A',
    goldHex: '#F2CC63',
    badgeHex: '#173A67',
    jerseyPattern: 'linear-gradient(135deg, #173A67 0%, #0E131F 50%, #D5B46A 100%)',
    description: 'Royal dark navy, Champagne gold, Ballon d’Or glow & Galáctico dominance.',
  },
  {
    id: 'selecao-passion',
    name: 'Seleção Passion',
    sublabel: 'Portugal Euro 2016',
    clubYear: 'European Champions · All-Time International Goalscorer',
    tag: 'PRESET 3',
    bgHex: '#0B0D0F',
    accentHex: '#C8102E',
    goldHex: '#D4AF37',
    badgeHex: '#006633',
    jerseyPattern: 'linear-gradient(135deg, #C8102E 0%, #8A0018 50%, #006633 100%)',
    description: 'High-energy Portuguese crimson red, pitch emerald green & victory gold.',
  },
  {
    id: 'the-red-devil',
    name: 'The Red Devil',
    sublabel: 'Manchester United (03–09 & 21–22)',
    clubYear: 'Moscow 2008 UCL · 42 Goals Ballon d’Or · 3 Premier League',
    tag: 'PRESET 4',
    bgHex: '#0B0C0E',
    accentHex: '#C70101',
    goldHex: '#D4AF37',
    badgeHex: '#FFFFFF',
    jerseyPattern: 'linear-gradient(135deg, #C70101 0%, #8A0000 60%, #14161B 100%)',
    description: 'High-contrast Old Trafford pitch, vibrant United Red, pure white & Ballon d’Or gold.',
  },
  {
    id: 'el-bicho',
    name: 'El Bicho',
    sublabel: 'Real Madrid 2.0 (2016–2018)',
    clubYear: 'Historic 3-Peat UCL Dynasty · All-Time Prime',
    tag: 'PRESET 5',
    bgHex: '#101114',
    accentHex: '#00B8B0',
    goldHex: '#D4AF37',
    badgeHex: '#6B3FA0',
    jerseyPattern: 'linear-gradient(135deg, #00B8B0 0%, #087E83 50%, #6B3FA0 100%)',
    description: 'Peak 3-Peat UEFA Champions League prime: 17/18 pitch black, electric Aero Reef turquoise, Champions purple & victory gold.',
  },
  {
    id: 'le-zebre',
    name: 'Le Zebre',
    sublabel: 'Juventus Era (2018–2021)',
    clubYear: '101 Goals · Back-to-Back Scudetto Supremacy',
    tag: 'PRESET 6',
    bgHex: '#08080A',
    accentHex: '#FFFFFF',
    goldHex: '#D4AF37',
    badgeHex: '#D4AF37',
    jerseyPattern: 'linear-gradient(135deg, #08080A 0%, #121216 45%, #FFFFFF 50%, #121216 55%, #D4AF37 100%)',
    description: 'High-fashion monochrome split panels, stark pitch black, crisp stark white & Scudetto gold supremacy.',
  },
];

// EXHIBIT 03: Seleção Passion Override (Exact requested data structure)
export const exhibitSelecao: MuseumExhibit = {
  id: 'selecao-passion',
  exhibitNumber: 'EXHIBIT 03',
  title: 'Paris 2016 (Euro Glory) — European Champions',
  clubEra: 'Portugal National Team | UEFA Euro 2016',
  matchDate: '10 July 2016 · Portugal 1–0 France (AET)',
  photoAsset: exhibit03Pic,
  image: exhibit03Pic,
  focalY: 15,
  hasImage: true,
  narrative: `Ronaldo leaves the final in tears after a knee injury but continues inspiring Portugal from the sidelines. Éder scores in extra time to secure a historic 1–0 victory over France. Portugal become European champions, and Ronaldo lifts his first major international trophy. He finishes the tournament with 3 goals, 3 assists, 7 appearances and 12 shots on target, earning the Silver Boot.`,
  statsSummary: '1 Title · 30 Appearances · 14 Goals · 7 Assists',
  euroRecords: [
    '6 Tournaments — 2004, 2008, 2012, 2016, 2020 and 2024',
    '30 Appearances — All-time record for the most EURO final-tournament appearances',
    '14 Goals — The most goals in EURO history',
    '7 Assists — Joint-record figure in tournament statistics',
    '5 Tournaments Scoring — Only player to score at 5 consecutive EURO editions (2004–2020)',
    '1 European Championship Title — Captained Portugal to glory in 2016',
    '1 Runner-up Finish — Reached the final in 2004 at just 19 years old',
    '4 EURO Editions as Captain — 2012, 2016, 2020 and 2024',
  ],
  individualAwards: [
    'UEFA Euro 2016 Silver Boot (3 Goals, 3 Assists)',
    'UEFA Euro Team of the Tournament (2004, 2012, 2016)',
    'All-Time Men’s International Top Scorer (130+ Goals)',
    'Most Caps in Men’s International Football History (200+ Caps)',
  ],
  teamTrophies: [
    'UEFA European Championship 2016 (Champions)',
    'UEFA Nations League 2019 (Champions)',
    'UEFA Euro 2004 (Runners-up)',
  ],
};

// EXHIBIT 04: The Red Devil Override (Exact requested data structure)
export const exhibitRedDevil: MuseumExhibit = {
  id: 'the-red-devil',
  exhibitNumber: 'EXHIBIT 04',
  title: 'Official Archival Vault — Moscow 2008',
  clubEra: 'Manchester United | 2007/08',
  matchDate: '21 May 2008 · Manchester United 1–1 Chelsea (6–5 on penalties)',
  photoAsset: exhibit4Img,
  image: exhibit4Img,
  focalY: 40,
  hasImage: true,
  narrative: `At the Luzhniki Stadium in Moscow, Cristiano Ronaldo rose above Michael Essien to meet Wes Brown’s cross, powering a towering header past Petr Čech in the 26th minute. His goal put Manchester United ahead in an all-English UEFA Champions League final.

Although Chelsea equalised and Ronaldo missed his penalty in the shootout, Manchester United triumphed 6–5 on penalties, completing a historic Premier League and Champions League double.

Ronaldo finished the season with 42 goals in all competitions, including 31 Premier League goals and 8 Champions League goals. His extraordinary campaign established him as the best player in the world.`,
  statsSummary: '42 goals · 16 individual honours · 2 major trophies',
  individualAwards: [
    'Ballon d’Or — 2008',
    'FIFA World Player of the Year — 2008',
    'FIFPro World Player of the Year — 2007/08',
    'UEFA Club Footballer of the Year — 2007/08',
    'UEFA Club Forward of the Year — 2007/08',
    'European Golden Shoe — 2007/08',
    'Premier League Golden Boot — 2007/08',
    'Premier League Player of the Season — 2007/08',
    'PFA Players’ Player of the Year — 2007/08',
    'PFA Fans’ Player of the Year — 2007/08',
    'FWA Footballer of the Year — 2007/08',
    'PFA Premier League Team of the Year — 2007/08',
    'Sir Matt Busby Player of the Year — 2007/08',
    'Premier League Player of the Month — January 2008',
    'Premier League Player of the Month — March 2008',
    'UEFA Champions League Top Scorer — 2007/08',
  ],
  teamTrophies: [
    'Premier League — 2007/08',
    'UEFA Champions League — 2007/08',
    'FA Community Shield (2008)',
    'FIFA Club World Cup (2008)',
  ],
};

// EXHIBIT 05: El Bicho Override (Exact requested data structure)
export const exhibitElBicho: MuseumExhibit = {
  id: 'el-bicho',
  exhibitNumber: 'EXHIBIT 05',
  title: 'Real Madrid Apex Era — Historic 3-Peat Dynasty (2016–2018)',
  clubEra: 'Real Madrid | 2015/16 – 2017/18',
  matchDate: '3 Consecutive UEFA Champions League Titles (2016, 2017, 2018)',
  photoAsset: exhibit05Pic,
  image: exhibit05Pic,
  focalY: 20,
  hasImage: true,
  
  // Three Finals Narrative
  finals: [
    {
      year: '2016 — La Undécima: The Decisive Penalty',
      dateLocation: '28 May 2016 · San Siro, Milan',
      match: 'Real Madrid 1–1 Atlético Madrid (5–3 pens)',
      narrative: 'After 120 minutes, Ronaldo stepped up to take Madrid\'s fifth penalty after Juanfran hit the post. He converted, sealing Real Madrid\'s 11th European Cup — La Undécima.',
      stats: '12 Apps · 16 Goals · 4 Assists | Winner & Top Scorer',
    },
    {
      year: '2017 — La Duodécima: The Cardiff Brace',
      dateLocation: '3 June 2017 · Millennium Stadium, Cardiff',
      match: 'Real Madrid 4–1 Juventus',
      narrative: 'Ronaldo opened the scoring in the 20th minute and struck again in the 64th minute off Luka Modrić\'s cross. He became the first player to score in three UCL finals and earned Man of the Match.',
      stats: '13 Apps · 12 Goals · 6 Assists | Winner, Top Scorer & Final MOTM',
    },
    {
      year: '2018 — La Decimotercera: The Three-Peat',
      dateLocation: '26 May 2018 · NSC Olimpiyskiy, Kyiv',
      match: 'Real Madrid 3–1 Liverpool',
      narrative: 'Real Madrid completed an unprecedented three consecutive Champions League titles in the modern era. Ronaldo finished as leading scorer for the sixth consecutive season with 15 goals.',
      stats: '13 Apps · 15 Goals · 3 Assists | Winner & Top Scorer',
    },
  ],

  // Dedicated 3-Peat Dynasty Summary Section Data
  threePeatEraStats: {
    title: "CR7’S CHAMPIONS LEAGUE THREE-PEAT ERA (2016–2018)",
    totalGoals: 43,
    totalAppearances: 38,
    totalAssists: 13,
    uclTitles: "3 consecutive (2016, 2017, 2018)",
    topScorerStreak: "3 consecutive seasons (2015/16, 2016/17, 2017/18)",
    goalsPerApp: 1.13,
    uclFinalsGoals: "2 (both scored in the 2017 final)",
    finalsWon: "3 out of 3",
    seasonGoalBreakdown: "16 (2015/16) · 12 (2016/17) · 15 (2017/18)",
  },
  narrative: `No team in modern Champions League history had ever defended the trophy until Ronaldo and Real Madrid won three consecutive European crowns in 2016, 2017, and 2018. Ronaldo scored against every European giant, including iconic overhead bicycle kicks and knockout hat-tricks, scoring 43 Champions League goals across the historic 3-Peat Dynasty.`,
  statsSummary: '38 Apps · 43 Goals · 13 Assists (3 Consecutive UCL Titles)',
  individualAwards: [
    '3x Consecutive UEFA Champions League Top Scorer',
    'UEFA Men’s Player of the Year (2016, 2017)',
    'Ballon d’Or (2016, 2017)',
    'FIFA The Best Men’s Player (2016, 2017)',
    'UCL Final Man of the Match (Cardiff 2017)',
  ],
  teamTrophies: [
    'UEFA Champions League 2015/16 (La Undécima)',
    'UEFA Champions League 2016/17 (La Duodécima)',
    'UEFA Champions League 2017/18 (La Decimotercera)',
    '3x FIFA Club World Cup (2016, 2017, 2018)',
    '2x UEFA Super Cup (2016, 2017)',
    'La Liga Championship (2016/17)',
  ],
};

// EXHIBIT 06: Le Zebre Override (Exact requested data structure)
export const exhibitLeZebre: MuseumExhibit = {
  id: 'le-zebre',
  exhibitNumber: 'EXHIBIT 06',
  title: 'International Cap Record Holder — Turin 2019 Comeback Hat-Trick',
  clubEra: 'Juventus | 2018/19 Season',
  matchDate: '12 March 2019 · Juventus 3–0 Atlético Madrid (3–2 agg)',
  photoAsset: exhibit06Pic,
  image: exhibit06Pic,
  focalY: 25,
  hasImage: true,
  narrative: `Cristiano Ronaldo produced a legendary comeback at Juventus Stadium, scoring twice with towering headers before sealing a 3–0 victory with an 86th-minute penalty. After Juventus lost the first leg 2–0, his hat-trick sent them through to the Champions League quarter-finals with a 3–2 aggregate victory. It was his eighth Champions League hat-trick, and he once again tormented Atlético Madrid, scoring his 24th goal against them. Ronaldo delivered when Juventus needed him most, turning an almost impossible comeback into one of the greatest nights of his Juventus era.`,
  statsSummary: '43 Apps · 28 Goals · 10 Assists (2018/19 Season)',
  juventusSeasonStats: {
    allCompetitions: {
      appearances: 43,
      goals: 28,
      assists: 10,
      goalContributions: 38,
    },
    championsLeague: {
      appearances: 9,
      goals: 6,
      assists: 2,
      goalContributions: 8,
    },
  },
  individualAwards: [
    'Serie A Footballer of the Year — 2019',
    '8th UEFA Champions League Career Hat-Trick',
    '24 Career Goals against Atlético Madrid',
    'Serie A Team of the Year — 2018/19',
    'Juventus Player of the Season — 2018/19',
  ],
  teamTrophies: [
    'Serie A Scudetto Title — 2018/19',
    'Supercoppa Italiana — 2018',
  ],
};

// EXHIBIT 02: Galáctico Gold Override (Exact requested data structure)
export const exhibitGalacticoGold: MuseumExhibit = {
  id: 'galactico-gold',
  exhibitNumber: 'EXHIBIT 02',
  title: '5x Ballon d’Or Dynasty — Lisbon 2014 & La Décima',
  clubEra: 'Real Madrid | 2013/14 Season',
  matchDate: '24 May 2014 · Real Madrid 4–1 Atlético Madrid (AET)',
  photoAsset: exhibit02Pic,
  image: exhibit02Pic,
  focalY: 30,
  hasImage: true,
  narrative: `120th minute · Real Madrid 4–1 Atlético Madrid. Ronaldo converts the penalty, takes off his shirt and flexes in front of the crowd. The match is already decided, but the image becomes one of the defining photographs of his Madrid era. Closed his goal tally with a record-breaking 17th goal at the 120th minute to seal Madrid’s 4–1 victory and their historic La Décima triumph.`,
  statsSummary: '17 UCL Goals (All-Time Record) · 68 Total Goal Contributions · La Décima & Copa del Rey',
  seasonStats201314: {
    allCompetitions: {
      appearances: 47,
      goals: 51,
      assists: 17,
      goalContributions: 68,
      trophies: ['UEFA Champions League', 'Copa del Rey'],
    },
    championsLeague: {
      appearances: 11,
      goals: 17, // Record for most goals in a single UCL season
      assists: 5,
      goalContributions: 22,
      achievement: 'Competition Top Scorer & Single-Season Record Holder',
    },
  },
  individualAwards: [
    'UEFA Champions League Top Scorer (Record 17 Goals)',
    'European Golden Shoe (31 La Liga Goals)',
    'FIFA Ballon d’Or — 2014',
    'UEFA Best Player in Europe Award (2013/14)',
    'LFP Best Player & Best Forward (2013/14)',
    'Trofeo Alfredo Di Stéfano (2013/14)',
    'FIFA FIFPro World XI — 2014',
  ],
  teamTrophies: [
    'UEFA Champions League 2013/14 (La Décima)',
    'Copa del Rey 2013/14',
    'UEFA Super Cup 2014',
    'FIFA Club World Cup 2014',
  ],
};

export const ALL_MUSEUM_EXHIBITS: MuseumExhibit[] = [
  {
    id: 'mr-champions-league',
    exhibitNumber: 'EXHIBIT 01',
    title: 'Mr. Champions League — The European Nights',
    clubEra: 'UEFA Champions League · European Nights',
    matchDate: '183 Apps · 140 Goals · 5 Modern Era Titles · 7 Golden Boots',
    photoAsset: exhibit01Pic,
    image: exhibit01Pic,
    focalY: 20,
    hasImage: true,
    narrative: `Cristiano Ronaldo defined European football's pinnacle competition. With 140 goals in 183 appearances and 5 modern era titles, CR7 transformed the UEFA Champions League into his personal arena.`,
    statsSummary: '183 Apps · 140 Goals · 5 Titles · 7 Top-Scorer Seasons',
    individualAwards: [
      '2007–08: UEFA Club Footballer of the Year & Club Forward of the Year',
      '2013–14 & 2015–16: UEFA Best Player in Europe',
      '2016–17: UEFA Men\'s Player of the Year & Champions League Forward of the Season',
      '2017–18: UEFA Champions League Forward of the Season',
      '2024: UEFA Champions League All-Time Top Scorer Special Award',
      'Team of the Year: 15 appearances in UEFA.com\'s Team of the Year (record)',
    ],
    teamTrophies: [
      '2007–08: Manchester United (Defeated Chelsea 6–5 on pens after 1–1)',
      '2013–14: Real Madrid (Defeated Atlético Madrid 4–1 AET — La Décima)',
      '2015–16: Real Madrid (Defeated Atlético Madrid on pens after 1–1)',
      '2016–17: Real Madrid (Defeated Juventus 4–1)',
      '2017–18: Real Madrid (Defeated Liverpool 3–1 — Three-Peat)',
    ],
  },
  exhibitGalacticoGold,
  exhibitSelecao,
  exhibitRedDevil,
  exhibitElBicho,
  exhibitLeZebre,
];

interface JerseyCabinetProps {
  currentPreset: GoatPreset;
  onSelectPreset: (preset: GoatPreset) => void;
  compact?: boolean;
}

export const JerseyCabinet: React.FC<JerseyCabinetProps> = ({
  currentPreset,
  onSelectPreset,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cabinetTab, setCabinetTab] = useState<'museum' | 'kits'>('museum');

  // Exhibit 01 Custom Photo & Focal Crop State
  const [exhibit01Image, setExhibit01Image] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cr7_exhibit_01_custom_image');
      if (saved && !saved.startsWith('/input_file_0.png') && !saved.startsWith('blob:')) {
        return saved;
      }
      return exhibit01Pic;
    } catch {
      return exhibit01Pic;
    }
  });
  const [exhibit01FocalY, setExhibit01FocalY] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cr7_exhibit_01_focal_y');
      return saved !== null ? Number(saved) : 20;
    } catch {
      return 20;
    }
  });
  const [isEditingExhibit01, setIsEditingExhibit01] = useState<boolean>(false);

  const handleExhibit01ImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setExhibit01Image(imageUrl);
      try {
        localStorage.setItem('cr7_exhibit_01_custom_image', imageUrl);
      } catch {
        // ignore
      }
    }
  };

  const handleUpdateFocalY = (val: number) => {
    setExhibit01FocalY(val);
    try {
      localStorage.setItem('cr7_exhibit_01_focal_y', String(val));
    } catch {
      // ignore
    }
  };

  // Standard Exhibit Selection Handler & Unified State Management
  const [activePavilionExhibit, setActivePavilionExhibit] = useState<MuseumExhibit | string | null>(null);

  // Trigger for Exhibit card click
  const handleCardClick = (exhibitId: MuseumExhibit | string) => {
    setActivePavilionExhibit(exhibitId); // Set to 'european-nights' or exhibit
  };

  const handleCloseModal = () => {
    setActivePavilionExhibit(null);
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
    const modal =
      document.getElementById('exhibit-01-modal') ||
      document.getElementById('uclPavilionModal') ||
      document.getElementById('pavilionModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  const normalizePreset = (p: GoatPreset) =>
    p === 'red-devil' ? 'the-red-devil' : p === 'european-nights' ? 'mr-champions-league' : p;
  const isEuropeanNightsActive = normalizePreset(currentPreset) === 'mr-champions-league';

  const isEuropeanNightsModal = useMemo(() => {
    if (!activePavilionExhibit) return false;
    if (typeof activePavilionExhibit === 'string') {
      return (
        activePavilionExhibit === 'european-nights' ||
        activePavilionExhibit === 'exhibit-01' ||
        activePavilionExhibit === 'mr-champions-league'
      );
    }
    return activePavilionExhibit.id === 'mr-champions-league' || activePavilionExhibit.id === 'european-nights';
  }, [activePavilionExhibit]);

  const activeExhibitModal: MuseumExhibit | null = useMemo(() => {
    if (!activePavilionExhibit) return null;
    if (typeof activePavilionExhibit === 'string') {
      return (
        ALL_MUSEUM_EXHIBITS.find(
          (e) =>
            e.id === activePavilionExhibit ||
            (activePavilionExhibit === 'european-nights' && (e.id === 'mr-champions-league' || e.id === 'european-nights')) ||
            (activePavilionExhibit === 'exhibit-01' && (e.id === 'mr-champions-league' || e.id === 'european-nights'))
        ) || ALL_MUSEUM_EXHIBITS[0]
      );
    }
    return activePavilionExhibit;
  }, [activePavilionExhibit]);

  const openUclPavilion = () => {
    setActivePavilionExhibit('european-nights');
  };

  const closeUclPavilion = () => {
    handleCloseModal();
  };

  // Synchronize body scroll locking
  useEffect(() => {
    if (activePavilionExhibit) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
    };
  }, [activePavilionExhibit]);

  // Allow closing via Escape key press & bind global modal controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Global helper methods for external/vanilla interaction
    (window as unknown as { openUclPavilion: () => void }).openUclPavilion = openUclPavilion;
    (window as unknown as { closeUclPavilion: () => void }).closeUclPavilion = closeUclPavilion;
    (window as unknown as { openPavilionModal: () => void }).openPavilionModal = openUclPavilion;
    (window as unknown as { closePavilionModal: () => void }).closePavilionModal = closeUclPavilion;
    (window as unknown as { handleCardClick: (id: string) => void }).handleCardClick = (id: string) => handleCardClick(id);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      delete (window as unknown as { openUclPavilion?: () => void }).openUclPavilion;
      delete (window as unknown as { closeUclPavilion?: () => void }).closeUclPavilion;
      delete (window as unknown as { openPavilionModal?: () => void }).openPavilionModal;
      delete (window as unknown as { closePavilionModal?: () => void }).closePavilionModal;
      delete (window as unknown as { handleCardClick?: (id: string) => void }).handleCardClick;
    };
  }, []);

  return (
    <section
      id="jersey-cabinet"
      className={`museum-section-container ${isExpanded ? 'expanded' : 'collapsed'} w-full rounded-2xl border backdrop-blur-xl transition-all duration-300 relative overflow-hidden my-3 shadow-lg`}
      style={{
        backgroundColor: 'var(--panel-card, var(--bg-card))',
        borderColor: 'var(--panel-border, var(--border-color))',
      }}
      aria-label="The Jersey Cabinet: CR7 Era Presets & Museum Hall of Fame"
    >
      {/* Top Banner & Header */}
      <div
        className="museum-section-header px-4 py-3 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ borderColor: 'var(--panel-border, var(--border-color))' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs border shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0757C8 0%, #D4AF37 100%)',
              borderColor: 'rgba(212, 175, 55, 0.4)',
            }}
          >
            7
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className="text-xs sm:text-sm font-black tracking-wider uppercase flex items-center gap-1.5"
                style={{ color: 'var(--text-main, var(--text-primary))' }}
              >
                <span>CR7 MUSEUM & HALL OF FAME</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    color: '#D4AF37',
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                  }}
                >
                  6 EXHIBITS
                </span>
                {!isExpanded && (
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">
                    (Click to expand)
                  </span>
                )}
              </h2>
            </div>
            <p
              className="text-[10px] sm:text-[11px] font-medium"
              style={{ color: 'var(--text-muted, var(--text-secondary))' }}
            >
              Madeira, Manchester, Madrid, Turin and Manchester again.
            </p>
          </div>
        </div>

        {/* Header Toolbar Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div
            className="inline-flex items-center p-0.5 rounded-xl border text-xs font-bold"
            style={{
              backgroundColor: 'var(--panel-elevated, rgba(255, 255, 255, 0.05))',
              borderColor: 'var(--panel-border, var(--border-color))',
            }}
          >
            <div
              className="px-2.5 py-1 rounded-lg text-[11px] font-black shadow-xs flex items-center gap-1.5"
              style={{
                backgroundColor: '#D4AF37',
                color: '#090B0F',
              }}
              title="CR7 Museum & Hall of Fame Exhibits"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{isExpanded ? 'Museum Exhibits' : 'Expand Exhibits'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all hover:scale-105 cursor-pointer shrink-0"
            style={{
              backgroundColor: 'var(--panel-elevated, var(--bg-card-subtle))',
              borderColor: 'var(--panel-border, var(--border-color))',
              color: 'var(--glow-accent, var(--accent))',
            }}
            aria-expanded={isExpanded}
            title={isExpanded ? 'Collapse Cabinet' : 'Expand Cabinet'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Container Content with Smooth Collapsible Transition */}
      <div className="museum-cards-wrapper">
        <div className="p-3 sm:p-4">
          {cabinetTab === 'museum' ? (
            /* ── CR7 MUSEUM & HALL OF FAME EXHIBITS GRID ── */
            <div className="museum-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_MUSEUM_EXHIBITS.map((exhibit) => {
                const isExhibitActive = normalizePreset(currentPreset) === normalizePreset(exhibit.id);

                // Exhibit 01: Mr. Champions League (The European Nights)
                if (exhibit.id === 'mr-champions-league' || exhibit.id === 'european-nights') {
                  return (
                    <div
                      key={exhibit.exhibitNumber}
                      className="museum-card exhibit-european-nights exhibit-preview-card-01 group cursor-pointer"
                      data-preset="european-nights"
                      data-theme="european-nights"
                      data-exhibit="01"
                      onClick={() => handleCardClick('european-nights')}
                    >
                      {/* Card Header Tag & Image Wrapper */}
                      <div className="relative w-full h-[240px] bg-[#050a14] rounded-t-xl overflow-hidden card-hero-image-wrapper">
                        {/* Top-Left Exhibit Badge (Uniform for all exhibits 01-06) */}
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 font-mono text-xs font-bold tracking-wider uppercase exhibit-tag">
                          EXHIBIT 01
                        </div>

                        {/* Hero Image Container */}
                        {exhibit.hasImage ? (
                          <img 
                            src={exhibit01Image || exhibit.image || exhibit01Pic} 
                            alt={exhibit.title}
                            className="card-preview-img w-full h-full block"
                            style={{
                              // Exhibit 01 uses 'contain' to fit the portrait frame perfectly without cropping hands/trophy
                              objectFit: 'contain',
                              objectPosition: 'center center',
                              padding: '8px 0',
                              display: 'block'
                            }}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = exhibit01Pic;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center gap-2 text-blue-400">
                            <span className="text-2xl">🏛️</span>
                            <span className="text-xs font-mono">Official Archival Vault</span>
                          </div>
                        )}

                        <span className="badge-number-7">#7</span>
                        <span
                          className="vertical-three-peat-badge"
                          style={{
                            borderColor: '#D4AF37',
                            color: '#F2CC63',
                            background: 'rgba(212, 175, 55, 0.25)',
                          }}
                        >
                          5 UCL
                        </span>
                      </div>

                      <div className="card-content">
                        <h3 className="exhibit-title">Mr. Champions League</h3>
                        <span className="match-meta">UEFA Champions League · 140 Goals · 5 Titles</span>

                        <p className="exhibit-description">{exhibit.narrative}</p>

                        <div className="exhibit-trophy-badge-row">
                          <span className="trophy-pill">⚽ 140 UCL Goals (#1)</span>
                          <span className="appearances-pill">👑 5 Champions Titles</span>
                          <span className="records-pill">🥇 7 Golden Boots</span>
                          <span className="trophy-pill">🏟️ 183 Appearances</span>
                        </div>

                        <div className="flex items-center gap-2 mt-auto pt-2">
                          <button
                            type="button"
                            className="activate-theme-btn flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick('european-nights');
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #0757C8 0%, #1A73E8 60%, #45B7FF 100%)',
                              color: '#FFFFFF',
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            }}
                          >
                            <span className="btn-text">INSPECT PAVILION</span>
                          </button>

                          <button
                            type="button"
                            className="px-3 py-2.5 rounded-xl border text-[11px] font-black font-mono transition-all cursor-pointer shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPreset('mr-champions-league');
                            }}
                            style={{
                              backgroundColor: isExhibitActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.08)',
                              color: isExhibitActive ? '#000000' : '#CBD5E1',
                              borderColor: isExhibitActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.2)',
                            }}
                            title="Activate European Nights Theme"
                          >
                            {isExhibitActive ? 'ACTIVE' : 'APPLY'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                  // Exhibit 05: El Bicho renders the exact dedicated structure requested
                  if (exhibit.id === 'el-bicho') {
                    return (
                      <div
                        key={exhibit.exhibitNumber}
                        className="museum-card exhibit-el-bicho group cursor-pointer"
                        data-preset="el-bicho"
                        onClick={() => handleCardClick(exhibit)}
                      >
                      {/* Outside Card Image Container */}
                      <div className="card-hero-image-wrapper">
                        {exhibit.image ? (
                          <img 
                            src={exhibit.image} 
                            alt={exhibit.title}
                            className="card-preview-img"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: `center ${exhibit.focalY}%`,
                              display: 'block'
                            }}
                          />
                        ) : (
                          <div className="exhibit-placeholder-box">
                            <span className="placeholder-icon">🏛️</span>
                            <span className="placeholder-text">Official Archival Vault</span>
                          </div>
                        )}
                        <span className="exhibit-tag">EXHIBIT 05</span>
                        <span className="badge-number-7">#7</span>
                        <span className="vertical-three-peat-badge">3 PEAT</span>
                      </div>

                      <div className="card-content">
                        <h3 className="exhibit-title">El Bicho — Historic 3-Peat Dynasty</h3>
                        <span className="match-meta">2016, 2017 & 2018 UEFA Champions League Titles</span>

                        {/* Main Narrative Overview */}
                        <div className="finals-timeline-preview">
                          <p>
                            <strong>2016 Milan:</strong> Converted the winning 5th penalty for La Undécima.
                          </p>
                          <p>
                            <strong>2017 Cardiff:</strong> Scored a brace vs. Juventus for La Duodécima (MOTM).
                          </p>
                          <p>
                            <strong>2018 Kyiv:</strong> Finished as top scorer (15 goals) to complete the historic 3-Peat.
                          </p>
                        </div>

                        {/* DEDICATED SEPARATE 3-PEAT STATS SECTION */}
                        <div className="three-peat-stats-block" onClick={(e) => e.stopPropagation()}>
                          <div className="stats-block-header">
                            <h4>🏆 CR7’S CHAMPIONS LEAGUE THREE-PEAT ERA (2016–2018)</h4>
                          </div>

                          <div className="three-peat-grid">
                            <div className="stat-box">
                              <span className="stat-val">43</span>
                              <span className="stat-lbl">Goals</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-val">38</span>
                              <span className="stat-lbl">Appearances</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-val">13</span>
                              <span className="stat-lbl">Assists</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-val">1.13</span>
                              <span className="stat-lbl">Goals/App</span>
                            </div>
                          </div>

                          <ul className="three-peat-list">
                            <li>
                              <strong>UCL Titles:</strong> 3 consecutive (2016, 2017, 2018)
                            </li>
                            <li>
                              <strong>Top Scorer Streak:</strong> 3 consecutive seasons (2015/16, 2016/17, 2017/18)
                            </li>
                            <li>
                              <strong>Finals Record:</strong> 3 Won out of 3 (2 goals in 2017 Final)
                            </li>
                            <li>
                              <strong>Season Goal Breakdown:</strong> 16 (15/16) · 12 (16/17) · 15 (17/18)
                            </li>
                          </ul>
                        </div>

                        <button
                          type="button"
                          className="activate-theme-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPreset('el-bicho');
                          }}
                        >
                          <span className="btn-text">
                            {isExhibitActive ? '✓ ACTIVE: EL BICHO (3-PEAT)' : 'ACTIVATE EL BICHO'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                }

                // General Museum Cards (Exhibit 01, 02, 03, 04, 06)
                return (
                  <div
                    key={exhibit.exhibitNumber}
                    className="museum-card group cursor-pointer"
                    data-preset={exhibit.id}
                    onClick={() => handleCardClick(exhibit)}
                  >
                    {/* Outside Card Image Container */}
                    <div className="card-hero-image-wrapper">
                      {exhibit.image ? (
                        <img 
                          src={exhibit.image} 
                          alt={exhibit.title}
                          className="card-preview-img"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: `center ${exhibit.focalY ?? 30}%`,
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div className="exhibit-placeholder-box">
                          <span className="placeholder-icon">🏛️</span>
                          <span className="placeholder-text">Official Archival Vault</span>
                        </div>
                      )}
                      <span className="exhibit-tag">{exhibit.exhibitNumber}</span>
                      <span className="badge-number-7">#7</span>
                    </div>

                    <div className="card-content">
                      <h3 className="exhibit-title">{exhibit.title}</h3>
                      <span className="match-meta">{exhibit.matchDate}</span>

                      <p className="exhibit-description">{exhibit.narrative}</p>

                      {/* Expanded Badge Rows customized per exhibit specifications */}
                      <div
                        className="exhibit-trophy-badge-row"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(exhibit);
                        }}
                      >
                        {exhibit.id === 'galactico-gold' ? (
                          <>
                            <span className="trophy-pill">⚽ 17 UCL Goals (Single-Season Record)</span>
                            <span className="records-pill">📊 68 Total Goal Contributions</span>
                            <span className="appearances-pill">🏆 La Décima Champion</span>
                          </>
                        ) : exhibit.id === 'le-zebre' ? (
                          <>
                            <span className="trophy-pill">⚽ 8th UCL Hat-Trick</span>
                            <span className="records-pill">📊 28 Goals (2018/19)</span>
                            <span className="appearances-pill">🔥 38 Goal Contributions</span>
                          </>
                        ) : exhibit.id === 'selecao-passion' ? (
                          <>
                            <span className="trophy-pill">🏆 Euro 2016 Champion</span>
                            <span className="records-pill">📊 14 Euro Goals (All-Time #1)</span>
                            <span className="appearances-pill">⭐ 30 Euro Caps</span>
                          </>
                        ) : exhibit.id === 'the-red-devil' ? (
                          <>
                            <span className="trophy-pill">🏆 16 Individual Awards</span>
                            <span className="trophy-pill">🏆 2 Major Trophies</span>
                            <span className="goals-pill">⚽ 42 Goals</span>
                          </>
                        ) : (
                          <>
                            <span className="trophy-pill">
                              🏆 {exhibit.individualAwards ? exhibit.individualAwards.length : 0} Awards
                            </span>
                            <span className="trophy-pill">
                              🏆 {exhibit.teamTrophies ? exhibit.teamTrophies.length : 0} Trophies
                            </span>
                            <span className="goals-pill">⚽ {exhibit.statsSummary.split('·')[0].trim()}</span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        className="activate-theme-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPreset(exhibit.id);
                        }}
                        style={{
                          backgroundColor:
                            exhibit.id === 'the-red-devil' ||
                            exhibit.id === 'selecao-passion' ||
                            exhibit.id === 'le-zebre' ||
                            exhibit.id === 'galactico-gold'
                              ? undefined
                              : isExhibitActive
                              ? '#D4AF37'
                              : undefined,
                          color:
                            isExhibitActive &&
                            exhibit.id !== 'the-red-devil' &&
                            exhibit.id !== 'selecao-passion' &&
                            exhibit.id !== 'le-zebre' &&
                            exhibit.id !== 'galactico-gold'
                              ? '#000000'
                              : '#FFFFFF',
                        }}
                      >
                        <span className="btn-text">
                          {exhibit.id === 'galactico-gold'
                            ? isExhibitActive
                              ? '✓ ACTIVE: GALÁCTICO GOLD'
                              : 'ACTIVATE GALÁCTICO GOLD'
                            : exhibit.id === 'le-zebre'
                            ? isExhibitActive
                              ? '✓ ACTIVE: LE ZEBRE'
                              : 'ACTIVATE LE ZEBRE'
                            : exhibit.id === 'selecao-passion'
                            ? isExhibitActive
                              ? '✓ ACTIVE: SELEÇÃO PASSION'
                              : 'ACTIVATE SELEÇÃO PASSION'
                            : exhibit.id === 'the-red-devil'
                            ? isExhibitActive
                              ? '✓ ACTIVE: THE RED DEVIL'
                              : 'ACTIVATE THE RED DEVIL'
                            : isExhibitActive
                            ? `✓ ACTIVE ERA: ${exhibit.id.toUpperCase()}`
                            : `ACTIVATE ${exhibit.id.replace(/-/g, ' ').toUpperCase()}`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── QUICK KIT SWATCHES GRID ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3">
              {GOAT_PRESETS.map((preset) => {
                const isActive = normalizePreset(currentPreset) === normalizePreset(preset.id);

                return (
                  <button
                    key={preset.id}
                    type="button"
                    id={`jersey-btn-${preset.id}`}
                    onClick={() => onSelectPreset(preset.id)}
                    className={`group relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 overflow-hidden ${
                      isActive
                        ? 'ring-2 ring-sky-400 shadow-xl scale-[1.02]'
                        : 'hover:scale-[1.01] hover:border-sky-400/50 opacity-90 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? 'var(--panel-elevated, #112A52)'
                        : 'var(--subboard-bg, rgba(6, 21, 46, 0.65))',
                      borderColor: isActive
                        ? 'var(--glow-accent, #45B7FF)'
                        : 'var(--panel-border, rgba(69, 183, 255, 0.2))',
                    }}
                    aria-pressed={isActive}
                  >
                    {/* Top: Preset Tag & Jersey Silhouette Mini Icon */}
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <span
                        className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          color: isActive ? '#D4AF37' : '#D7E3F4',
                        }}
                      >
                        {preset.tag}
                      </span>

                      {/* Active Illuminated #7 Indicator */}
                      {isActive ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider animate-pulse border shadow-xs"
                          style={{
                            backgroundColor: '#D4AF37',
                            color: '#030A17',
                            borderColor: '#FFFFFF',
                          }}
                        >
                          <span>#7</span>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold font-mono opacity-40 group-hover:opacity-80 transition-opacity">
                          #7
                        </span>
                      )}
                    </div>

                    {/* Middle: Preset Name and Sub-Label */}
                    <div>
                      <h3
                        className="text-xs sm:text-sm font-black tracking-tight leading-snug group-hover:text-sky-300 transition-colors"
                        style={{ color: 'var(--text-main, #FFFFFF)' }}
                      >
                        {preset.name}
                      </h3>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--glow-accent, #45B7FF)' }}>
                        {preset.sublabel}
                      </p>
                      <p
                        className="text-[10px] mt-0.5 line-clamp-1 opacity-75 font-mono"
                        style={{ color: 'var(--text-muted, #D7E3F4)' }}
                      >
                        {preset.clubYear}
                      </p>
                    </div>

                    {/* Bottom: Mini Color Swatch Pills */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 mt-auto">
                      <div className="flex items-center gap-1.5" title="Palette Swatches: Base · Accent · Trophy Gold">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-2xs"
                          style={{ backgroundColor: preset.bgHex }}
                          title={`Primary Background: ${preset.bgHex}`}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-2xs"
                          style={{ backgroundColor: preset.accentHex }}
                          title={`Main Accent: ${preset.accentHex}`}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-2xs"
                          style={{ backgroundColor: preset.goldHex }}
                          title={`Trophy Gold: ${preset.goldHex}`}
                        />
                      </div>

                      <span
                        className="text-[9px] font-bold uppercase tracking-wider transition-colors"
                        style={{ color: isActive ? '#D4AF37' : '#D7E3F4' }}
                      >
                        {isActive ? 'ACTIVE' : 'APPLY'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── STANDARD MUSEUM PAVILION MODAL (ROOT VIEWPORT PORTAL) ── */}
      {activePavilionExhibit && typeof document !== 'undefined'
        ? createPortal(
            <div
              id={isEuropeanNightsModal ? "exhibit-01-modal" : "uclPavilionModal"}
              className={`museum-pavilion-modal-backdrop museum-modal-backdrop pavilion-modal-overlay modal-overlay modal-backdrop exhibit-modal-backdrop animate-fade-in active ${
                isEuropeanNightsModal ? 'exhibit-01-modal-backdrop' : ''
              }`}
              data-active="true"
              data-exhibit={isEuropeanNightsModal ? "01" : undefined}
              onClick={handleCloseModal}
              role="dialog"
              aria-modal="true"
            >
        <div
          id={isEuropeanNightsModal ? "exhibit-01-modal" : undefined}
          data-exhibit={isEuropeanNightsModal ? "01" : (activeExhibitModal ? "modal" : undefined)}
          className={`museum-pavilion-modal-container museum-modal-card pavilion-modal-content modal-container modal-dialog exhibit-modal-card animate-scale-in ${
            isEuropeanNightsModal ? 'exhibit-01-card' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{
            borderColor: isEuropeanNightsModal
              ? 'rgba(69, 183, 255, 0.45)'
              : activeExhibitModal?.id === 'galactico-gold'
              ? '#D5B46A'
              : activeExhibitModal?.id === 'el-bicho'
              ? '#00B8B0'
              : activeExhibitModal?.id === 'the-red-devil'
              ? '#C70101'
              : activeExhibitModal?.id === 'selecao-passion'
              ? '#C8102E'
              : activeExhibitModal?.id === 'le-zebre'
              ? '#D4AF37'
              : 'rgba(212, 175, 55, 0.4)',
            boxShadow: isEuropeanNightsModal
              ? '0 0 45px rgba(7, 87, 200, 0.5), 0 20px 60px rgba(0, 0, 0, 0.85)'
              : '0 20px 60px rgba(0, 0, 0, 0.85)',
          }}
        >
          {isEuropeanNightsModal ? (
            <>
              {/* Sticky Modal Header for Exhibit 01 */}
              <div className="modal-header exhibit-modal-header pavilion-header">
                <button
                  type="button"
                  className="modal-close-btn exhibit-close-btn pavilion-close-btn close-modal-x close-pavilion-btn"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between gap-3 flex-wrap pr-12">
                  <div className="official-uefa-badge exhibit-tag">EXHIBIT 01</div>
                  <button
                    type="button"
                    onClick={() => onSelectPreset('mr-champions-league')}
                    className="pavilion-activate-chip"
                    title="Activate European Nights Theme"
                  >
                    <span>{isEuropeanNightsActive ? '✓ ACTIVE: MR. CHAMPIONS LEAGUE' : 'ACTIVATE THEME'}</span>
                  </button>
                </div>
                <h2 className="pr-12">Mr. Champions League</h2>
                <p className="subtitle pr-12">The definitive statistical legacy of Cristiano Ronaldo</p>
              </div>

              {/* Scrollable Modal Body for Exhibit 01 */}
              <div className="modal-body exhibit-modal-body pavilion-modal-body modal-body-scrollable uefa-archive-modal-body exhibit-01-body">
                {/* EXACT USER-PROVIDED IMAGE CONTAINER */}
                {/* Inside Modal Image Container */}
                <div className="exhibit-image-wrapper">
                  <img
                    src={exhibit01Image || exhibit01Pic}
                    alt="Mr. Champions League"
                    className="exhibit-hero-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      display: 'block'
                    }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = exhibit01Pic;
                    }}
                  />
                </div>

                {/* Career Glance Metrics */}
                <div className="metrics-section">
                  <h3>🏆 CAREER GLANCE METRICS</h3>
                  <div className="metrics-grid">
                    <div className="metric-box">
                      <span className="number">183</span>
                      <span className="label">APPEARANCES (ALL-TIME RECORD)</span>
                    </div>
                    <div className="metric-box">
                      <span className="number">140</span>
                      <span className="label">GOALS SCORED (ALL-TIME #1)</span>
                    </div>
                    <div className="metric-box">
                      <span className="number">5</span>
                      <span className="label">TITLES WON (MODERN ERA RECORD)</span>
                    </div>
                    <div className="metric-box">
                      <span className="number">7</span>
                      <span className="label">TOP-SCORER SEASONS (RECORD)</span>
                    </div>
                  </div>
                </div>

                {/* Club & Phase Breakdown */}
                <div className="breakdown-section">
                  <h3>📊 CLUB & PHASE BREAKDOWN</h3>
                  <div className="breakdown-grid">
                    <div className="breakdown-card">Real Madrid UCL Goals: 105 goals.</div>
                    <div className="breakdown-card">Manchester United UCL Goals: 21 goals.</div>
                    <div className="breakdown-card">Juventus UCL Goals: 14 goals.</div>
                    <div className="breakdown-card">Knockout-Stage Mastery: 67 goals (all-time record).</div>
                    <div className="breakdown-card">Hat-Trick Prowess: 8 hat-tricks (joint all-time record with Lionel Messi).</div>
                    <div className="breakdown-card">Single-Season Peak: 17 goals in the 2013/14 campaign (all-time record).</div>
                    <div className="breakdown-card">Scoring Streak: 11 consecutive scoring appearances (all-time record).</div>
                    <div className="breakdown-card">Finals Record: 6 final appearances (2008, 2009, 2014, 2016, 2017, 2018) with 4 goals scored across 3 different finals.</div>
                  </div>
                </div>

                {/* Additional Detailed Crowns Timeline, Golden Boot & UEFA Awards */}
                <EuropeanNightsPavilion
                  hideHeader={true}
                  hideSummarySections={true}
                  onActivatePreset={() => onSelectPreset('mr-champions-league')}
                  isActive={isEuropeanNightsActive}
                />
              </div>
            </>
          ) : activeExhibitModal ? (
            <>
              {/* Sticky Modal Header for Exhibits 02 - 06 */}
              <div className="modal-header exhibit-modal-header">
                <button
                  type="button"
                  className="modal-close-btn exhibit-close-btn pavilion-close-btn close-modal-x close-pavilion-btn"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 flex-wrap pr-12">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 font-mono bg-black/60 px-2.5 py-0.5 rounded border border-amber-400/30">
                    {activeExhibitModal.exhibitNumber} · {activeExhibitModal.clubEra}
                  </span>
                  {activeExhibitModal.id === 'el-bicho' && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest bg-teal-500/30 text-teal-300 border border-teal-400/50 uppercase font-mono">
                      3 PEAT
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-xl font-black text-white leading-tight pr-12">
                  {activeExhibitModal.title}
                </h2>
                <span
                  className="text-xs font-bold font-mono pr-12"
                  style={{
                    color:
                      activeExhibitModal.id === 'galactico-gold'
                        ? '#F2CC63'
                        : activeExhibitModal.id === 'el-bicho'
                        ? '#00E5FF'
                        : activeExhibitModal.id === 'selecao-passion'
                        ? '#FF6680'
                        : activeExhibitModal.id === 'le-zebre'
                        ? '#F2CC63'
                        : '#FF4D4D',
                  }}
                >
                  {activeExhibitModal.matchDate}
                </span>
              </div>

              {/* Scrollable Modal Body for Exhibits 02 - 06 */}
              <div className="modal-body exhibit-modal-body pavilion-modal-body modal-body-scrollable">
                {/* Inside Modal Image Container */}
                <div className="exhibit-image-wrapper">
                  {activeExhibitModal.hasImage && activeExhibitModal.image ? (
                    <img 
                      src={activeExhibitModal.image} 
                      alt={activeExhibitModal.title}
                      className="exhibit-hero-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <div className="exhibit-placeholder-box modal-placeholder">
                      <span className="placeholder-icon">🏛️</span>
                      <span className="placeholder-text">Official Archival Vault</span>
                    </div>
                  )}
                </div>

              {/* Three Finals Narrative Cards (Specific to El Bicho) */}
              {activeExhibitModal.finals && activeExhibitModal.finals.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-black tracking-wider uppercase text-teal-400 font-mono flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-teal-400" />
                    <span>The Three Consecutive Champions League Finals</span>
                  </h4>
                  <div className="flex flex-col gap-2">
                    {activeExhibitModal.finals.map((final, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border bg-slate-900/60 border-teal-500/25 flex flex-col gap-1 text-xs"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <strong className="text-white text-xs sm:text-sm font-black">{final.year}</strong>
                          <span className="text-[10px] font-mono text-teal-300 font-bold">{final.dateLocation}</span>
                        </div>
                        <span className="text-amber-400 font-mono text-[11px] font-bold">{final.match}</span>
                        <p className="text-slate-300 text-xs leading-relaxed mt-0.5">{final.narrative}</p>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold mt-1">
                          📊 {final.stats}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dedicated 3-Peat Dynasty Summary Section Data */}
              {activeExhibitModal.threePeatEraStats && (
                <div className="three-peat-stats-block">
                  <div className="stats-block-header">
                    <h4>🏆 {activeExhibitModal.threePeatEraStats.title}</h4>
                  </div>

                  <div className="three-peat-grid">
                    <div className="stat-box">
                      <span className="stat-val">{activeExhibitModal.threePeatEraStats.totalGoals}</span>
                      <span className="stat-lbl">Goals</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-val">{activeExhibitModal.threePeatEraStats.totalAppearances}</span>
                      <span className="stat-lbl">Appearances</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-val">{activeExhibitModal.threePeatEraStats.totalAssists}</span>
                      <span className="stat-lbl">Assists</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-val">{activeExhibitModal.threePeatEraStats.goalsPerApp}</span>
                      <span className="stat-lbl">Goals/App</span>
                    </div>
                  </div>

                  <ul className="three-peat-list">
                    <li>
                      <strong>UCL Titles:</strong> {activeExhibitModal.threePeatEraStats.uclTitles}
                    </li>
                    <li>
                      <strong>Top Scorer Streak:</strong> {activeExhibitModal.threePeatEraStats.topScorerStreak}
                    </li>
                    <li>
                      <strong>Finals Record:</strong> {activeExhibitModal.threePeatEraStats.finalsWon} ({activeExhibitModal.threePeatEraStats.uclFinalsGoals})
                    </li>
                    <li>
                      <strong>Season Goal Breakdown:</strong> {activeExhibitModal.threePeatEraStats.seasonGoalBreakdown}
                    </li>
                  </ul>
                </div>
              )}

              {/* Narrative Description (if no finals list or general) */}
              {!activeExhibitModal.finals && (
                <div className="p-3.5 rounded-xl border bg-black/40 border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {activeExhibitModal.narrative}
                </div>
              )}

              {/* Stats Summary Pill */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
                <Trophy className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{activeExhibitModal.statsSummary}</span>
              </div>

              {/* Real Madrid 2013/14 Season Statistics Breakdown (Specific to Galáctico Gold) */}
              {activeExhibitModal.seasonStats201314 && (
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase text-amber-400 font-mono mb-2 flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-amber-400" />
                    <span>Real Madrid 2013/14 Season Statistics & Records</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                    <div className="p-3 rounded-xl border bg-slate-900/70 border-white/15 flex flex-col gap-2">
                      <span className="text-xs font-black text-white uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                        <span>All Competitions</span>
                        <span className="text-amber-400">68 G/A</span>
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                        <div>Appearances: <strong className="text-white font-black">{activeExhibitModal.seasonStats201314.allCompetitions.appearances}</strong></div>
                        <div>Goals: <strong className="text-amber-400 font-black">{activeExhibitModal.seasonStats201314.allCompetitions.goals}</strong></div>
                        <div>Assists: <strong className="text-sky-400 font-black">{activeExhibitModal.seasonStats201314.allCompetitions.assists}</strong></div>
                        <div>Contributions: <strong className="text-emerald-400 font-black">{activeExhibitModal.seasonStats201314.allCompetitions.goalContributions}</strong></div>
                      </div>
                      <div className="text-[11px] text-amber-300 pt-1 border-t border-white/10">
                        🏆 Trophies: {activeExhibitModal.seasonStats201314.allCompetitions.trophies.join(' · ')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border bg-slate-900/70 border-white/15 flex flex-col gap-2">
                      <span className="text-xs font-black text-white uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                        <span>UEFA Champions League</span>
                        <span className="text-amber-400">22 G/A</span>
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                        <div>Appearances: <strong className="text-white font-black">{activeExhibitModal.seasonStats201314.championsLeague.appearances}</strong></div>
                        <div>Goals: <strong className="text-amber-400 font-black">{activeExhibitModal.seasonStats201314.championsLeague.goals} (All-Time Record)</strong></div>
                        <div>Assists: <strong className="text-sky-400 font-black">{activeExhibitModal.seasonStats201314.championsLeague.assists}</strong></div>
                        <div>Contributions: <strong className="text-emerald-400 font-black">{activeExhibitModal.seasonStats201314.championsLeague.goalContributions}</strong></div>
                      </div>
                      <div className="text-[11px] text-teal-300 pt-1 border-t border-white/10 font-bold">
                        ⭐ {activeExhibitModal.seasonStats201314.championsLeague.achievement}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Juventus 2018/19 Season Statistics Breakdown (Specific to Le Zebre) */}
              {activeExhibitModal.juventusSeasonStats && (
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase text-amber-400 font-mono mb-2 flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-amber-400" />
                    <span>Juventus 2018/19 Season Statistics</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                    <div className="p-3 rounded-xl border bg-slate-900/70 border-white/15 flex flex-col gap-2">
                      <span className="text-xs font-black text-white uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                        <span>All Competitions</span>
                        <span className="text-amber-400">38 G/A</span>
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                        <div>Appearances: <strong className="text-white font-black">{activeExhibitModal.juventusSeasonStats.allCompetitions.appearances}</strong></div>
                        <div>Goals: <strong className="text-amber-400 font-black">{activeExhibitModal.juventusSeasonStats.allCompetitions.goals}</strong></div>
                        <div>Assists: <strong className="text-sky-400 font-black">{activeExhibitModal.juventusSeasonStats.allCompetitions.assists}</strong></div>
                        <div>Contributions: <strong className="text-emerald-400 font-black">{activeExhibitModal.juventusSeasonStats.allCompetitions.goalContributions}</strong></div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border bg-slate-900/70 border-white/15 flex flex-col gap-2">
                      <span className="text-xs font-black text-white uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                        <span>UEFA Champions League</span>
                        <span className="text-amber-400">8 G/A</span>
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                        <div>Appearances: <strong className="text-white font-black">{activeExhibitModal.juventusSeasonStats.championsLeague.appearances}</strong></div>
                        <div>Goals: <strong className="text-amber-400 font-black">{activeExhibitModal.juventusSeasonStats.championsLeague.goals}</strong></div>
                        <div>Assists: <strong className="text-sky-400 font-black">{activeExhibitModal.juventusSeasonStats.championsLeague.assists}</strong></div>
                        <div>Contributions: <strong className="text-emerald-400 font-black">{activeExhibitModal.juventusSeasonStats.championsLeague.goalContributions}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EURO Records Breakdown (Specific to Seleção Passion) */}
              {activeExhibitModal.euroRecords && (
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase text-emerald-400 font-mono mb-2 flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-emerald-400" />
                    <span>UEFA EURO All-Time Tournament Records ({activeExhibitModal.euroRecords.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {activeExhibitModal.euroRecords.map((record, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg border text-xs font-medium flex items-center gap-2 bg-emerald-950/30 border-emerald-500/20 text-slate-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{record}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual Awards Breakdown */}
              {activeExhibitModal.individualAwards && activeExhibitModal.individualAwards.length > 0 && (
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase text-amber-400 font-mono mb-2 flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-amber-400" />
                    <span>Individual Honours & Accolades ({activeExhibitModal.individualAwards.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {activeExhibitModal.individualAwards.map((award, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg border text-xs font-medium flex items-center gap-2 bg-slate-900/60 border-white/10 text-slate-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Trophies */}
              {activeExhibitModal.teamTrophies && activeExhibitModal.teamTrophies.length > 0 && (
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase text-sky-400 font-mono mb-2 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-sky-400" />
                    <span>Team Trophies & Season Titles ({activeExhibitModal.teamTrophies.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {activeExhibitModal.teamTrophies.map((trophy, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg border text-xs font-medium flex items-center gap-2 bg-slate-900/60 border-white/10 text-slate-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        <span>{trophy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activate Preset Button in Modal */}
              <div className="pt-2 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  className="activate-theme-btn w-full sm:w-auto"
                  onClick={() => {
                    onSelectPreset(activeExhibitModal.id);
                    handleCloseModal();
                  }}
                  style={{
                    backgroundColor:
                      activeExhibitModal.id === 'galactico-gold'
                        ? undefined
                        : activeExhibitModal.id === 'el-bicho'
                        ? undefined
                        : activeExhibitModal.id === 'selecao-passion'
                        ? undefined
                        : activeExhibitModal.id === 'the-red-devil'
                        ? undefined
                        : activeExhibitModal.id === 'le-zebre'
                        ? undefined
                        : '#D4AF37',
                    color: '#FFFFFF',
                  }}
                >
                  <Flame className="w-4 h-4" />
                  <span className="btn-text">
                    {activeExhibitModal.id === 'galactico-gold'
                      ? 'ACTIVATE GALÁCTICO GOLD'
                      : activeExhibitModal.id === 'el-bicho'
                      ? 'ACTIVATE EL BICHO'
                      : activeExhibitModal.id === 'le-zebre'
                      ? 'ACTIVATE LE ZEBRE'
                      : activeExhibitModal.id === 'selecao-passion'
                      ? 'ACTIVATE SELEÇÃO PASSION'
                      : activeExhibitModal.id === 'the-red-devil'
                      ? 'ACTIVATE THE RED DEVIL'
                      : `ACTIVATE ${activeExhibitModal.id.replace(/-/g, ' ').toUpperCase()}`}
                  </span>
                </button>
              </div>
            </div>
          </>
        ) : null}
        </div>
      </div>,
      document.body
    )
  : null}

      {/* ================= EXHIBIT 01 UPLOAD & CROP CONTROL MODAL/PANEL ================= */}
      {isEditingExhibit01 && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="photo-config-overlay"
              onClick={() => setIsEditingExhibit01(false)}
            >
              <div
                className="photo-config-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Exhibit 01 Photo &amp; Display Customizer</h3>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                    onClick={() => setIsEditingExhibit01(false)}
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-slate-300">
                  Upload your photo and drag the slider to choose exactly what appears on the outside card thumbnail.
                </p>

                {/* File Uploader */}
                <div className="upload-box">
                  <label htmlFor="custom-exhibit-upload-cabinet" className="upload-label">
                    📁 Choose New Photo from Device
                  </label>
                  <input
                    id="custom-exhibit-upload-cabinet"
                    type="file"
                    accept="image/*"
                    onChange={handleExhibit01ImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Live Cropping Slider Control */}
                <div className="crop-slider-group">
                  <label className="text-sm text-slate-200">
                    Outside Thumbnail Focal Point (Vertical Position: <strong className="text-blue-400">{exhibit01FocalY}%</strong>)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={exhibit01FocalY}
                    onChange={(e) => handleUpdateFocalY(Number(e.target.value))}
                    className="focal-range-slider"
                  />
                  <span className="slider-hint">0% = Top of photo | 50% = Center | 100% = Bottom</span>
                </div>

                {/* Live Preview Comparison */}
                <div className="config-preview-row">
                  <div className="mini-preview flex flex-col gap-1.5">
                    <span className="text-xs text-slate-300 font-semibold">Outside Thumbnail Preview:</span>
                    <div
                      className="mini-card-thumb border border-blue-500/40 bg-[#050a14]"
                      style={{ height: '120px', overflow: 'hidden', borderRadius: '8px' }}
                    >
                      <img
                        src={exhibit01Image}
                        alt="Thumbnail preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: `center ${exhibit01FocalY}%`,
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = exhibit01Pic;
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-semibold transition cursor-pointer"
                    onClick={() => {
                      setExhibit01Image(exhibit01Pic);
                      setExhibit01FocalY(20);
                      try {
                        localStorage.removeItem('cr7_exhibit_01_custom_image');
                        localStorage.removeItem('cr7_exhibit_01_focal_y');
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    Reset Default
                  </button>
                  <button
                    type="button"
                    className="close-config-btn"
                    onClick={() => setIsEditingExhibit01(false)}
                  >
                    Save &amp; Close
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </section>
  );
};
