
export interface DrugDosage {
  min: number;
  max: number;
  avg: number; // The default value to auto-fill
  freq: string; // e.g., 'q12h', 'q24h'
}

export interface DrugForm {
  type: string; // e.g., 'Injectable', 'Tablet', 'Suspension'
  concentration: number; // mg/ml or mg/tab
  unit: string; // 'ml', 'tab'
  routes: string[]; // ['IV', 'IM', 'SC', 'PO']
}

export interface DrugEntry {
  id: string;
  genericName: { en: string; fa: string };
  tradeNames: string[];
  category: string;
  forms: DrugForm[];
  speciesDosage: {
    [speciesId: string]: DrugDosage; // speciesId matches the IDs in vet-store (dog, cat, etc.)
  };
  contraindications?: string[];
}

export const drugDatabase: DrugEntry[] = [
  {
    id: 'd001',
    genericName: { en: 'Cefazolin', fa: 'سفازولین' },
    tradeNames: ['Kefzol', 'Ancef'],
    category: 'Antibiotic',
    forms: [
      { type: 'Injectable', concentration: 250, unit: 'ml', routes: ['IV', 'IM'] } // Reconstituted often to 200-300 mg/ml
    ],
    speciesDosage: {
      'dog': { min: 20, max: 30, avg: 22, freq: 'q8h' },
      'cat': { min: 20, max: 30, avg: 22, freq: 'q8h' },
      'horse': { min: 10, max: 20, avg: 15, freq: 'q6-8h' }
    }
  },
  {
    id: 'd002',
    genericName: { en: 'Metronidazole', fa: 'مترونیدازول' },
    tradeNames: ['Flagyl', 'Metrojyl'],
    category: 'Antibiotic/Antiprotozoal',
    forms: [
      { type: 'Injectable', concentration: 5, unit: 'ml', routes: ['IV'] }, // Infusion usually 5mg/ml
      { type: 'Suspension', concentration: 25, unit: 'ml', routes: ['PO'] } // 125mg/5ml
    ],
    speciesDosage: {
      'dog': { min: 10, max: 25, avg: 15, freq: 'q12h' },
      'cat': { min: 10, max: 25, avg: 15, freq: 'q12h' },
      'horse': { min: 15, max: 25, avg: 20, freq: 'q6h' }
    }
  },
  {
    id: 'd003',
    genericName: { en: 'Meloxicam', fa: 'ملوکسیکام' },
    tradeNames: ['Metacam', 'Loxicom'],
    category: 'NSAID',
    forms: [
      { type: 'Injectable', concentration: 5, unit: 'ml', routes: ['SC', 'IV'] }, // Often 5mg/ml for small animals
      { type: 'Injectable (Large)', concentration: 20, unit: 'ml', routes: ['IV', 'SC'] }
    ],
    speciesDosage: {
      'dog': { min: 0.1, max: 0.2, avg: 0.2, freq: 'q24h' }, // Loading dose
      'cat': { min: 0.1, max: 0.3, avg: 0.2, freq: 'One-time' }, // Caution needed
      'horse': { min: 0.6, max: 0.6, avg: 0.6, freq: 'q24h' }
    }
  },
  {
    id: 'd004',
    genericName: { en: 'Tramadol', fa: 'ترامادول' },
    tradeNames: ['Ultram'],
    category: 'Analgesic',
    forms: [
      { type: 'Injectable', concentration: 50, unit: 'ml', routes: ['IV', 'IM'] }
    ],
    speciesDosage: {
      'dog': { min: 2, max: 5, avg: 3, freq: 'q8-12h' },
      'cat': { min: 1, max: 2, avg: 1, freq: 'q12h' } // Bitter taste issues
    }
  },
  {
    id: 'd005',
    genericName: { en: 'Enrofloxacin', fa: 'انروفلوکساسین' },
    tradeNames: ['Baytril'],
    category: 'Antibiotic',
    forms: [
      { type: 'Injectable', concentration: 50, unit: 'ml', routes: ['IM', 'SC'] }, // 5%
      { type: 'Injectable', concentration: 100, unit: 'ml', routes: ['IM', 'SC'] } // 10%
    ],
    speciesDosage: {
      'dog': { min: 5, max: 20, avg: 5, freq: 'q24h' },
      'cat': { min: 5, max: 5, avg: 5, freq: 'q24h' }, // Risk of blindness >5mg/kg
      'reptile': { min: 5, max: 10, avg: 10, freq: 'q24-48h' },
      'bird': { min: 10, max: 20, avg: 15, freq: 'q12h' }
    }
  },
  {
    id: 'd006',
    genericName: { en: 'Furosemide', fa: 'فوروزماید' },
    tradeNames: ['Lasix', 'Salix'],
    category: 'Diuretic',
    forms: [
      { type: 'Injectable', concentration: 50, unit: 'ml', routes: ['IV', 'IM', 'SC'] } // 5%
    ],
    speciesDosage: {
      'dog': { min: 2, max: 6, avg: 4, freq: 'q8-12h' },
      'cat': { min: 1, max: 4, avg: 2, freq: 'q12h' },
      'horse': { min: 0.5, max: 1, avg: 1, freq: 'q12h' },
      'cow': { min: 0.5, max: 1, avg: 1, freq: 'q12h' }
    }
  },
  {
    id: 'd007',
    genericName: { en: 'Dexamethasone', fa: 'دگزامتازون' },
    tradeNames: ['Dexa', 'Azium'],
    category: 'Steroid',
    forms: [
      { type: 'Injectable', concentration: 4, unit: 'ml', routes: ['IV', 'IM'] } // 4mg/ml sodium phosphate
    ],
    speciesDosage: {
      'dog': { min: 0.1, max: 0.5, avg: 0.2, freq: 'q24h' },
      'cat': { min: 0.1, max: 0.5, avg: 0.2, freq: 'q24h' },
      'horse': { min: 0.04, max: 0.1, avg: 0.05, freq: 'q24h' },
      'cow': { min: 0.04, max: 0.1, avg: 0.05, freq: 'q24h' }
    }
  },
  {
    id: 'd008',
    genericName: { en: 'Amoxicillin', fa: 'آموکسی‌سیلین' },
    tradeNames: ['Amoxi-Inject', 'Betamox'],
    category: 'Antibiotic',
    forms: [
      { type: 'Injectable (LA)', concentration: 150, unit: 'ml', routes: ['IM', 'SC'] } // 15% LA
    ],
    speciesDosage: {
      'dog': { min: 10, max: 20, avg: 15, freq: 'q24h' },
      'cat': { min: 10, max: 20, avg: 15, freq: 'q24h' },
      'cow': { min: 7, max: 15, avg: 10, freq: 'q24h' }
    }
  },
  {
    id: 'd009',
    genericName: { en: 'Co-Amoxiclav', fa: 'کو-آموکسی‌کلاو' },
    tradeNames: ['Synulox', 'Clavamox'],
    category: 'Antibiotic',
    forms: [
      { type: 'Injectable', concentration: 175, unit: 'ml', routes: ['SC', 'IM'] } // 140+35 mg/ml
    ],
    speciesDosage: {
      'dog': { min: 12.5, max: 25, avg: 13.75, freq: 'q12h' }, // Standard dose 8.75 mg/kg or 12.5-25 depending on ref
      'cat': { min: 62.5, max: 62.5, avg: 62.5, freq: 'q12h' } // Often per animal, normalized here
    }
  },
  {
    id: 'd010',
    genericName: { en: 'Ketamine', fa: 'کتامین' },
    tradeNames: ['Ketaset', 'Vetalar'],
    category: 'Anesthetic',
    forms: [
      { type: 'Injectable', concentration: 100, unit: 'ml', routes: ['IV', 'IM'] } // 10%
    ],
    speciesDosage: {
      'dog': { min: 5, max: 10, avg: 5, freq: 'Induction' },
      'cat': { min: 5, max: 15, avg: 10, freq: 'Induction' },
      'horse': { min: 2.2, max: 2.2, avg: 2.2, freq: 'Induction' }
    }
  },
  {
    id: 'd011',
    genericName: { en: 'Diazepam', fa: 'دیازپام' },
    tradeNames: ['Valium'],
    category: 'Sedative/Anticonvulsant',
    forms: [
      { type: 'Injectable', concentration: 5, unit: 'ml', routes: ['IV'] } // 5mg/ml
    ],
    speciesDosage: {
      'dog': { min: 0.25, max: 0.5, avg: 0.5, freq: 'PRN' },
      'cat': { min: 0.25, max: 0.5, avg: 0.25, freq: 'PRN' }
    }
  },
  {
    id: 'd012',
    genericName: { en: 'Ivermectin', fa: 'ایورمکتین' },
    tradeNames: ['Ivomec'],
    category: 'Antiparasitic',
    forms: [
      { type: 'Injectable', concentration: 10, unit: 'ml', routes: ['SC'] } // 1%
    ],
    speciesDosage: {
      'cow': { min: 0.2, max: 0.2, avg: 0.2, freq: 'Once' },
      'sheep': { min: 0.2, max: 0.2, avg: 0.2, freq: 'Once' },
      'dog': { min: 0.006, max: 0.3, avg: 0.2, freq: 'Variable' } // High caution for MDR1 breeds
    }
  }
];
