import { getDbItem, setDbItem, DB_KEYS } from './db';

export interface TaxConfig {
  resortId: string;
  resortName: string;
  gstin: string;
  legalEntityName: string;
  stateCode: string;
  stateName: string;
  roomGstUnder7500: number; // 12%
  roomGstAbove7500: number; // 18%
  restaurantGst: number;   // 5%
  isCompositionScheme: boolean;
  enableInterstateIGST: boolean;
  notes: string;
  updatedAt: string;
}

export const INDIAN_STATES = [
  { code: '30', name: 'Goa' },
  { code: '08', name: 'Rajasthan' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '32', name: 'Kerala' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '07', name: 'Delhi NCR' },
  { code: '24', name: 'Gujarat' },
  { code: '33', name: 'Tamil Nadu' },
];

const DEFAULT_TAX_CONFIG: TaxConfig = {
  resortId: 'resort-1',
  resortName: 'Joy Resorts Candolim Beachfront',
  gstin: '30AAACJ9988G1Z7',
  legalEntityName: 'Joy Resorts Sanctuary Hospitality Pvt Ltd',
  stateCode: '30',
  stateName: 'Goa',
  roomGstUnder7500: 12,
  roomGstAbove7500: 18,
  restaurantGst: 5,
  isCompositionScheme: false,
  enableInterstateIGST: false,
  notes: 'Registered under Regular Taxpayer GST scheme with HSN 9963 hospitality classification.',
  updatedAt: new Date().toLocaleDateString('en-IN'),
};

export function getTaxConfig(resortId = 'resort-1'): TaxConfig {
  const configs = getDbItem<Record<string, TaxConfig>>(DB_KEYS.TAX_CONFIG, {});
  if (configs && configs[resortId]) {
    return configs[resortId];
  }
  return { ...DEFAULT_TAX_CONFIG, resortId };
}

export function saveTaxConfig(config: TaxConfig): boolean {
  const configs = getDbItem<Record<string, TaxConfig>>(DB_KEYS.TAX_CONFIG, {});
  configs[config.resortId] = {
    ...config,
    updatedAt: new Date().toLocaleDateString('en-IN'),
  };
  setDbItem(DB_KEYS.TAX_CONFIG, configs);
  return true;
}

export function calculateGST(
  baseAmount: number,
  category: 'RoomUnder7500' | 'RoomAbove7500' | 'Dining',
  isInterstate = false,
  resortId = 'resort-1'
) {
  const config = getTaxConfig(resortId);
  const rate =
    category === 'Dining'
      ? config.restaurantGst
      : category === 'RoomAbove7500'
      ? config.roomGstAbove7500
      : config.roomGstUnder7500;

  const totalGst = Math.round((baseAmount * rate) / 100);

  if (isInterstate || config.enableInterstateIGST) {
    return {
      baseAmount,
      rate,
      cgst: 0,
      sgst: 0,
      igst: totalGst,
      totalGst,
      grandTotal: baseAmount + totalGst,
      isInterstate: true,
    };
  }

  const half = Math.round(totalGst / 2);
  return {
    baseAmount,
    rate,
    cgst: half,
    sgst: totalGst - half,
    igst: 0,
    totalGst,
    grandTotal: baseAmount + totalGst,
    isInterstate: false,
  };
}
