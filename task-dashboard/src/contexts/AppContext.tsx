import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { AppData, Task, Project, Member, PageId, GameScorecard, WeeklyInsight } from '../types';
import { dataService } from '../data/dataService';
import { seedData } from '../data/seedData';

interface AppState {
  data: AppData;
  activePage: PageId;
  sidebarCollapsed: boolean;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'SET_PAGE'; payload: PageId }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'UPDATE_MEMBER'; payload: Member }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'ADD_SCORECARD'; payload: GameScorecard }
  | { type: 'UPDATE_SCORECARD'; payload: GameScorecard }
  | { type: 'DELETE_SCORECARD'; payload: string }
  | { type: 'ADD_INSIGHT'; payload: WeeklyInsight }
  | { type: 'UPDATE_INSIGHT'; payload: WeeklyInsight }
  | { type: 'DELETE_INSIGHT'; payload: string }
  | { type: 'RESET_DATA' }
  | { type: 'SET_LOADING'; payload: boolean };

function appReducer(state: AppState, action: AppAction): AppState {
  let newData: AppData;

  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false };

    case 'SET_PAGE':
      return { ...state, activePage: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'ADD_TASK':
      newData = dataService.addTask(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'UPDATE_TASK':
      newData = dataService.updateTask(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'DELETE_TASK':
      newData = dataService.deleteTask(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'ADD_PROJECT':
      newData = dataService.addProject(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'UPDATE_PROJECT':
      newData = dataService.updateProject(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'DELETE_PROJECT':
      newData = dataService.deleteProject(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'ADD_MEMBER':
      newData = dataService.addMember(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'UPDATE_MEMBER':
      newData = dataService.updateMember(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'DELETE_MEMBER':
      newData = dataService.deleteMember(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'ADD_SCORECARD':
      newData = dataService.addScorecard(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'UPDATE_SCORECARD':
      newData = dataService.updateScorecard(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'DELETE_SCORECARD':
      newData = dataService.deleteScorecard(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'ADD_INSIGHT':
      newData = dataService.addInsight(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'UPDATE_INSIGHT':
      newData = dataService.updateInsight(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'DELETE_INSIGHT':
      newData = dataService.deleteInsight(state.data, action.payload);
      dataService.save(newData);
      return { ...state, data: newData };

    case 'RESET_DATA':
      newData = dataService.resetToSeed();
      return { ...state, data: newData };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    default:
      return state;
  }
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
