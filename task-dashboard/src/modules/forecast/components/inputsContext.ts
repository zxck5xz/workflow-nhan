import { createContext, useContext } from 'react';
import type { Inputs } from '../engine';
import type { Path } from '../lib/paths';
import type { Issues } from '../lib/validate';

interface InputsContextValue {
  inputs: Inputs;
  set: (path: Path, value: unknown) => void;
  issues: Issues;
}

export const InputsContext = createContext<InputsContextValue | null>(null);

export function useInputs(): InputsContextValue {
  const ctx = useContext(InputsContext);
  if (!ctx) throw new Error('useInputs must be used inside InputsContext');
  return ctx;
}
