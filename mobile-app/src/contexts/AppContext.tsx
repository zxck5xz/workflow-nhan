import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react';
import type { AppData, Task, Project, Member, GameScorecard, WeeklyInsight } from '../types';
import { seedData } from '../services/seedData';
import { dataService } from '../services/dataService';

interface AppState {
  data: AppData;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_DATA' }
  | { type: 'REFRESH_DATA' }
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
  | { type: 'ADD_INSIGHT'; payload: WeeklyInsight };

function appReducer(state: AppState, action: AppAction): AppState {
  const { data } = state;
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'RESET_DATA':
      return { ...state, data: seedData };
    case 'REFRESH_DATA':
      return state;
    case 'ADD_TASK':
      return { ...state, data: dataService.addTask(data, action.payload) };
    case 'UPDATE_TASK':
      return { ...state, data: dataService.updateTask(data, action.payload) };
    case 'DELETE_TASK':
      return { ...state, data: dataService.deleteTask(data, action.payload) };
    case 'ADD_PROJECT':
      return { ...state, data: dataService.addProject(data, action.payload) };
    case 'UPDATE_PROJECT':
      return { ...state, data: dataService.updateProject(data, action.payload) };
    case 'DELETE_PROJECT':
      return { ...state, data: dataService.deleteProject(data, action.payload) };
    case 'ADD_MEMBER':
      return { ...state, data: dataService.addMember(data, action.payload) };
    case 'UPDATE_MEMBER':
      return { ...state, data: dataService.updateMember(data, action.payload) };
    case 'DELETE_MEMBER':
      return { ...state, data: dataService.deleteMember(data, action.payload) };
    case 'ADD_SCORECARD':
      return { ...state, data: dataService.addScorecard(data, action.payload) };
    case 'ADD_INSIGHT':
      return { ...state, data: dataService.addInsight(data, action.payload) };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    data: seedData,
    loading: true,
  });
  const initialLoad = useRef(true);

  useEffect(() => {
    dataService.load().then((data) => {
      dispatch({ type: 'SET_DATA', payload: data });
    });
  }, []);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    dataService.save(state.data);
  }, [state.data]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
