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
  | { type: `ADD_${'TASK' | 'PROJECT' | 'MEMBER' | 'SCORECARD' | 'INSIGHT'}`; payload: any }
  | { type: `UPDATE_${'TASK' | 'PROJECT' | 'MEMBER' | 'SCORECARD' | 'INSIGHT'}`; payload: any }
  | { type: `DELETE_${'TASK' | 'PROJECT' | 'MEMBER' | 'SCORECARD' | 'INSIGHT'}`; payload: any }
  | { type: 'ADD_TASK_PROJECT'; payload: any };

function camelCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function dataServiceFn(dataService: any, verb: string, entity: string) {
  const key =
    `${verb === 'ADD' ? 'add' : verb === 'UPDATE' ? 'update' : 'delete'}${camelCase(entity)}` as keyof typeof dataService;
  return dataService[key] as (data: AppData, payload: any) => AppData;
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

  useEffect(() => {
    dataService.load().then((data) => {
      dispatch({ type: 'SET_DATA', payload: data });
    });
  }, []);

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

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
