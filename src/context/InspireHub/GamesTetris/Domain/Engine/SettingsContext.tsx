import { createContext, useContext, useState, ReactNode } from 'react';

export interface TetraverseSettings {
  realmId: string;
  pieceSetId: string;
  shakeEnabled: boolean;
  particlesEnabled: boolean;
}

interface Ctx {
  settings: TetraverseSettings;
  setRealm: (id: string) => void;
  setPieceSet: (id: string) => void;
  toggleShake: () => void;
  toggleParticles: () => void;
}

const STORAGE_KEY = 'tetraverse_settings_v1';

const defaultSettings: TetraverseSettings = {
  realmId: 'classic',
  pieceSetId: 'classic',
  shakeEnabled: true,
  particlesEnabled: true,
};

const loadInitial = (): TetraverseSettings => {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
};

const persist = (s: TetraverseSettings) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore quota errors
  }
};

const TetraverseSettingsContext = createContext<Ctx | null>(null);

export const TetraverseSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<TetraverseSettings>(loadInitial);

  const update = (next: TetraverseSettings) => {
    setSettings(next);
    persist(next);
  };

  const value: Ctx = {
    settings,
    setRealm: (realmId) => update({ ...settings, realmId }),
    setPieceSet: (pieceSetId) => update({ ...settings, pieceSetId }),
    toggleShake: () => update({ ...settings, shakeEnabled: !settings.shakeEnabled }),
    toggleParticles: () => update({ ...settings, particlesEnabled: !settings.particlesEnabled }),
  };

  return <TetraverseSettingsContext.Provider value={value}>{children}</TetraverseSettingsContext.Provider>;
};

export const useTetraverseSettings = (): Ctx => {
  const ctx = useContext(TetraverseSettingsContext);
  if (!ctx) throw new Error('useTetraverseSettings must be used inside TetraverseSettingsProvider');
  return ctx;
};
