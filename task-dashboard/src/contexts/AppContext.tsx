import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { AppData, PageId } from '../types';
import { dataService } from '../data/dataService';
import { seedData } from '../data/seedData';
import { useAuth } from './AuthContext';

interface AppState {
  data: AppData;
  activePage: PageId;
  sidebarCollapsed: boolean;
  loading: boolean;
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false };

    case 'SET_PAGE':
      return { ...state, activePage: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'RESET_DATA':
      return { ...state, data: dataService.resetToSeed() };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    default: {
      const match = action.type.match(
        /^(ADD|UPDATE|DELETE)_(TASK|PROJECT|MEMBER|SCORECARD|INSIGHT)$/,
      );
      if (!match) return state;
      const [, verb, entity] = match;

      const fn = dataServiceFn(dataService, verb, entity);

      const newData = fn(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };
    }
  }
}

type AppAction =
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'SET_PAGE'; payload: PageId }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'RESET_DATA' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: `ADD_${'TASK' | 'PROJECT' | 'MEMBER' | 'SCORECARD' | 'INSIGHT'}`; payload: unknown }
  | { type: `UPDATE_${'TASK' | 'PROJECT' | 'MEMBER' | 'SCORECARD' | 'INSIGHT'}`; payload: unknown }
  | { type: `DELETE_${'TASK' | 'PROJECT' | 'MEMBER' | 'SCORECARD' | 'INSIGHT'}`; payload: unknown }
  | { type: 'ADD_TASK_PROJECT'; payload: unknown };

function camelCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function dataServiceFn(service: typeof dataService, verb: string, entity: string) {
  const key =
    `${verb === 'ADD' ? 'add' : verb === 'UPDATE' ? 'update' : 'delete'}${camelCase(entity)}` as keyof typeof service;
  return service[key] as unknown as (data: AppData, payload: unknown) => AppData;
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setPage: (page: PageId) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    data: seedData,
    activePage: 'project-control',
    sidebarCollapsed: false,
    loading: true,
  });

  // Load once a user is signed in (and again if the user changes): before
  // login there is no token, so the backend would reject the request and we
  // would fall back to stale local/seed data.
  const { user } = useAuth();
  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    dispatch({ type: 'SET_LOADING', payload: true });
    dataService.load().then((data) => {
      if (!cancelled) dispatch({ type: 'SET_DATA', payload: data });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const setPage = useCallback((page: PageId) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, setPage, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with its provider
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
