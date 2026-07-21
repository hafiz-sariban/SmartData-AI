import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface MicroTransaction {
  id: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  total_amount: number;
  payment_method: string;
  source: 'ocr' | 'voice' | 'cold-start';
  confidence_score?: number;
}

export interface ColdStartProfile {
  sector: string;
  busiestDays: string[];
  avgDailyRevenue: number;
  district: string;
  createdAt: string;
}

export interface DeadStockItem {
  name: string;
  tiedUpValue: number;
  bundlePartner: string;
}

interface MicroStoreState {
  transactions: MicroTransaction[];
  coldStartProfile: ColdStartProfile | null;
  addTransaction: (tx: Omit<MicroTransaction, 'id'>) => void;
  addTransactions: (txs: Omit<MicroTransaction, 'id'>[]) => void;
  setColdStartProfile: (profile: ColdStartProfile) => void;
  reset: () => void;
}

const MicroStoreContext = createContext<MicroStoreState | null>(null);

const SECTORS: Record<string, { deadStock: DeadStockItem[]; peakDay: string; peakUplift: number; supplierBill: number; daysToBill: number }> = {
  'F&B Hawker': {
    deadStock: [
      { name: 'Kuih Lapis (unsold batch)', tiedUpValue: 320, bundlePartner: 'Teh Tarik combo' },
      { name: 'Frozen Roti Canai dough', tiedUpValue: 180, bundlePartner: 'Curry dipping set' },
    ],
    peakDay: 'Friday',
    peakUplift: 40,
    supplierBill: 1200,
    daysToBill: 5,
  },
  'Home Baker': {
    deadStock: [
      { name: 'Butter cream frosting surplus', tiedUpValue: 250, bundlePartner: 'Cupcake decorating kit' },
      { name: 'Custom cake boxes (overorder)', tiedUpValue: 150, bundlePartner: 'Gift tag add-on' },
    ],
    peakDay: 'Saturday',
    peakUplift: 55,
    supplierBill: 800,
    daysToBill: 7,
  },
  'Fashion Retail (Instagram)': {
    deadStock: [
      { name: 'Summer dress (slow size M)', tiedUpValue: 500, bundlePartner: 'Accessory scarf combo' },
      { name: 'Flip flops (end-season)', tiedUpValue: 220, bundlePartner: 'Beach tote bundle' },
    ],
    peakDay: 'Sunday',
    peakUplift: 35,
    supplierBill: 1500,
    daysToBill: 6,
  },
  'Small Service Provider': {
    deadStock: [
      { name: 'Unused service vouchers', tiedUpValue: 400, bundlePartner: 'Follow-up maintenance plan' },
      { name: 'Spare parts overstock', tiedUpValue: 300, bundlePartner: 'Service package upgrade' },
    ],
    peakDay: 'Weekday evenings',
    peakUplift: 25,
    supplierBill: 600,
    daysToBill: 10,
  },
};

export function getSectorBenchmarks(sector: string) {
  return SECTORS[sector] ?? SECTORS['F&B Hawker'];
}

export function MicroStoreProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<MicroTransaction[]>([]);
  const [coldStartProfile, setColdStartProfileState] = useState<ColdStartProfile | null>(null);

  const genId = () => Math.random().toString(36).slice(2, 10);

  const addTransaction = useCallback((tx: Omit<MicroTransaction, 'id'>) => {
    setTransactions((prev) => [{ ...tx, id: genId() }, ...prev]);
  }, []);

  const addTransactions = useCallback((txs: Omit<MicroTransaction, 'id'>[]) => {
    setTransactions((prev) => [...txs.map((t) => ({ ...t, id: genId() })), ...prev]);
  }, []);

  const setColdStartProfile = useCallback((profile: ColdStartProfile) => {
    setColdStartProfileState(profile);
  }, []);

  const reset = useCallback(() => {
    setTransactions([]);
    setColdStartProfileState(null);
  }, []);

  return (
    <MicroStoreContext.Provider
      value={{ transactions, coldStartProfile, addTransaction, addTransactions, setColdStartProfile, reset }}
    >
      {children}
    </MicroStoreContext.Provider>
  );
}

export function useMicroStore() {
  const ctx = useContext(MicroStoreContext);
  if (!ctx) throw new Error('useMicroStore must be used within MicroStoreProvider');
  return ctx;
}
