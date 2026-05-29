import type { AppData } from '../types';
import { seedData } from './seedData';

const useLocal = import.meta.env.VITE_USE_LOCAL_DATA === 'true';

export async function loadLocalTestData(): Promise<AppData | null> {
  if (!useLocal) return null;
  try {
    const { localTestData } = await import('./localTestData');
    console.log('Using local test data');
    return localTestData;
  } catch (e) {
    console.error('Failed to load local test data', e);
    return null;
  }
}

export const activeSeedData: AppData = seedData;
