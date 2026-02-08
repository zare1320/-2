
export interface DrugDosage {
  min: number;
  max: number;
  avg: number; // The default value to auto-fill
  freq: string; // e.g., 'q12h', 'q24h'
}

export interface DrugForm {
  label: string; // Display name e.g. "Vial 1g", "Tablet 250mg"
  type: string; // e.g., 'Injectable', 'Tablet', 'Suspension'
  concentration: number; // mg/ml or mg/tab. If 0, user must specify (e.g. powder)
  unit: string; // 'ml', 'tab', 'g'
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
    tradeNames: ['Kefzol', 'Ancef', 'Cefazol'],
    category: 'Antibiotic',
    forms: [
      { label: 'Vial 250 mg', type: 'Injectable', concentration: 0, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Vial 500 mg', type: 'Injectable', concentration: 0, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Vial 1 g', type: 'Injectable', concentration: 0, unit: 'ml', routes: ['IV', 'IM'] }
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
      { label: 'Tablet 250 mg', type: 'Tablet', concentration: 250, unit: 'tab', routes: ['PO'] },
      { label: 'Suspension 125mg/5ml', type: 'Suspension', concentration: 25, unit: 'ml', routes: ['PO'] },
      { label: 'Infusion 500mg/100ml (0.5%)', type: 'Injectable', concentration: 5, unit: 'ml', routes: ['IV'] }
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
    tradeNames: ['Metacam', 'Loxicom', 'Meloxicam'],
    category: 'NSAID',
    forms: [
      { label: 'Inj 20 mg/ml (Large Animal)', type: 'Injectable', concentration: 20, unit: 'ml', routes: ['IV', 'SC'] },
      { label: 'Inj 5 mg/ml (Small Animal)', type: 'Injectable', concentration: 5, unit: 'ml', routes: ['SC', 'IV'] },
      { label: 'Ampoule 15 mg/1.5ml', type: 'Injectable', concentration: 10, unit: 'ml', routes: ['IM', 'IV'] },
      { label: 'Tablet 7.5 mg', type: 'Tablet', concentration: 7.5, unit: 'tab', routes: ['PO'] },
      { label: 'Tablet 15 mg', type: 'Tablet', concentration: 15, unit: 'tab', routes: ['PO'] }
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
      { label: 'Ampoule 50 mg/1ml', type: 'Injectable', concentration: 50, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Ampoule 100 mg/2ml', type: 'Injectable', concentration: 50, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Tablet 50 mg', type: 'Tablet', concentration: 50, unit: 'tab', routes: ['PO'] },
      { label: 'Tablet 100 mg', type: 'Tablet', concentration: 100, unit: 'tab', routes: ['PO'] }
    ],
    speciesDosage: {
      'dog': { min: 2, max: 5, avg: 3, freq: 'q8-12h' },
      'cat': { min: 1, max: 2, avg: 1, freq: 'q12h' } // Bitter taste issues
    }
  },
  {
    id: 'd005',
    genericName: { en: 'Enrofloxacin', fa: 'انروفلوکساسین' },
    tradeNames: ['Baytril', 'Enroflx'],
    category: 'Antibiotic',
    forms: [
      { label: 'Inj 5% (50 mg/ml)', type: 'Injectable', concentration: 50, unit: 'ml', routes: ['IM', 'SC'] },
      { label: 'Inj 10% (100 mg/ml)', type: 'Injectable', concentration: 100, unit: 'ml', routes: ['IM', 'SC'] },
      { label: 'Oral Solution 10%', type: 'Suspension', concentration: 100, unit: 'ml', routes: ['PO'] },
      { label: 'Tablet 50 mg', type: 'Tablet', concentration: 50, unit: 'tab', routes: ['PO'] },
      { label: 'Tablet 150 mg', type: 'Tablet', concentration: 150, unit: 'tab', routes: ['PO'] }
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
      { label: 'Ampoule 20 mg/2ml', type: 'Injectable', concentration: 10, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Ampoule 40 mg/4ml', type: 'Injectable', concentration: 10, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Vet Inj 5% (50mg/ml)', type: 'Injectable', concentration: 50, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Tablet 40 mg', type: 'Tablet', concentration: 40, unit: 'tab', routes: ['PO'] }
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
      { label: 'Ampoule 8 mg/2ml', type: 'Injectable', concentration: 4, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Tablet 0.5 mg', type: 'Tablet', concentration: 0.5, unit: 'tab', routes: ['PO'] }
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
    tradeNames: ['Amoxi-Inject', 'Betamox', 'Amoxicir'],
    category: 'Antibiotic',
    forms: [
      { label: 'Inj LA 15% (150mg/ml)', type: 'Injectable', concentration: 150, unit: 'ml', routes: ['IM', 'SC'] },
      { label: 'Suspension 125 mg/5ml', type: 'Suspension', concentration: 25, unit: 'ml', routes: ['PO'] },
      { label: 'Suspension 250 mg/5ml', type: 'Suspension', concentration: 50, unit: 'ml', routes: ['PO'] },
      { label: 'Capsule 250 mg', type: 'Tablet', concentration: 250, unit: 'tab', routes: ['PO'] },
      { label: 'Capsule 500 mg', type: 'Tablet', concentration: 500, unit: 'tab', routes: ['PO'] }
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
    tradeNames: ['Synulox', 'Clavamox', 'Farmentin'],
    category: 'Antibiotic',
    forms: [
      { label: 'Suspension 156 (125+31)', type: 'Suspension', concentration: 31.2, unit: 'ml', routes: ['PO'] },
      { label: 'Suspension 312 (250+62)', type: 'Suspension', concentration: 62.4, unit: 'ml', routes: ['PO'] },
      { label: 'Tablet 375 mg', type: 'Tablet', concentration: 375, unit: 'tab', routes: ['PO'] },
      { label: 'Tablet 625 mg', type: 'Tablet', concentration: 625, unit: 'tab', routes: ['PO'] },
      { label: 'Inj 600 mg (500+100)', type: 'Injectable', concentration: 0, unit: 'ml', routes: ['IV', 'IM'] }, // Powder
      { label: 'Inj 1.2 g (1000+200)', type: 'Injectable', concentration: 0, unit: 'ml', routes: ['IV', 'IM'] }  // Powder
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
      { label: 'Vial 10% (500mg/5ml)', type: 'Injectable', concentration: 100, unit: 'ml', routes: ['IV', 'IM'] },
      { label: 'Vial 5% (500mg/10ml)', type: 'Injectable', concentration: 50, unit: 'ml', routes: ['IV', 'IM'] }
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
    tradeNames: ['Valium', 'Zepam'],
    category: 'Sedative/Anticonvulsant',
    forms: [
      { label: 'Ampoule 10 mg/2ml', type: 'Injectable', concentration: 5, unit: 'ml', routes: ['IV'] },
      { label: 'Tablet 2 mg', type: 'Tablet', concentration: 2, unit: 'tab', routes: ['PO'] },
      { label: 'Tablet 5 mg', type: 'Tablet', concentration: 5, unit: 'tab', routes: ['PO'] },
      { label: 'Tablet 10 mg', type: 'Tablet', concentration: 10, unit: 'tab', routes: ['PO'] }
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
      { label: 'Inj 1% (10 mg/ml)', type: 'Injectable', concentration: 10, unit: 'ml', routes: ['SC'] }
    ],
    speciesDosage: {
      'cow': { min: 0.2, max: 0.2, avg: 0.2, freq: 'Once' },
      'sheep': { min: 0.2, max: 0.2, avg: 0.2, freq: 'Once' },
      'dog': { min: 0.006, max: 0.3, avg: 0.2, freq: 'Variable' } // High caution for MDR1 breeds
    }
  }
];
