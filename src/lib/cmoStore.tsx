import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface BrandDNA {
  brandName: string;
  industry: string;
  icp: string;
  uvp: string;
  tone: string;
  forbiddenWords: string;
  locale: 'my' | 'sg' | 'id' | 'th';
}

interface CmoStoreState {
  brandDNA: BrandDNA;
  setBrandDNA: (dna: Partial<BrandDNA>) => void;
}

const defaultDNA: BrandDNA = {
  brandName: '',
  industry: '',
  icp: '',
  uvp: '',
  tone: 'Professional',
  forbiddenWords: '',
  locale: 'my',
};

const CmoStoreContext = createContext<CmoStoreState | null>(null);

export function CmoStoreProvider({ children }: { children: ReactNode }) {
  const [brandDNA, setBrandDNAState] = useState<BrandDNA>(defaultDNA);

  const setBrandDNA = useCallback((dna: Partial<BrandDNA>) => {
    setBrandDNAState((prev) => ({ ...prev, ...dna }));
  }, []);

  return (
    <CmoStoreContext.Provider value={{ brandDNA, setBrandDNA }}>
      {children}
    </CmoStoreContext.Provider>
  );
}

export function useCmoStore() {
  const ctx = useContext(CmoStoreContext);
  if (!ctx) throw new Error('useCmoStore must be used within CmoStoreProvider');
  return ctx;
}

export const localeLabels: Record<BrandDNA['locale'], string> = {
  my: 'Malaysia (RM)',
  sg: 'Singapore (S$)',
  id: 'Indonesia (IDR)',
  th: 'Thailand (THB)',
};

export const localeCurrency: Record<BrandDNA['locale'], string> = {
  my: 'RM',
  sg: 'S$',
  id: 'IDR',
  th: 'THB',
};
