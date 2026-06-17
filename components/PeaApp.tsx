'use client';
import { useState, useEffect } from 'react';
import { C, catCfg, statusCfg } from '@/lib/constants';
import { getCatSum, getPjSum, fmt } from '@/lib/utils';
import { INITIAL_WORKSPACES, INITIAL_FORM } from '@/lib/data';
import type { AppState, Workspace, Project } from '@/lib/types';
import Sidebar from './Sidebar';
import DashboardView from './views/DashboardView';
import ProjectsView from './views/ProjectsView';
import ProjectDetailView from './views/ProjectDetailView';
import Modals from './modals/Modals';
import MobileApp from './mobile/MobileApp';

export type { C };
export { getCatSum, getPjSum, fmt, catCfg, statusCfg };

const INITIAL_STATE: AppState = {
  view: 'dashboard',
  mobileScreen: 'workspace-list',
  selectedWorkspaceId: 1,
  selectedProjectId: null,
  showModal: null,
  editingCatId: null,
  editingTxId: null,
  targetCatId: null,
  editingDivId: null,
  viewingDivId: null,
  selectedDivisionId: null,
  filterStatus: 'all',
  activeBudgetCat: 'all',
  activeBudgetStatus: 'all',
  collapsedCats: {},
  searchQuery: '',
  showWsDropdown: false,
  form: INITIAL_FORM,
  workspaces: INITIAL_WORKSPACES,
};

export interface SharedProps {
  S: AppState;
  update: (patch: Partial<AppState>) => void;
  ws: Workspace | undefined;
  pj: Project | undefined;
  closeModal: () => void;
  modPj: (fn: (p: Project) => Project) => void;
}

export default function PeaApp() {
  const [S, setS] = useState<AppState>(INITIAL_STATE);
  const [isMobile, setIsMobile] = useState(false);
  const update = (patch: Partial<AppState>) => setS(prev => ({ ...prev, ...patch }));

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const ws = S.workspaces.find(w => w.id === S.selectedWorkspaceId);
  const pj = ws?.projects.find(p => p.id === S.selectedProjectId);

  const closeModal = () => update({
    showModal: null, editingCatId: null, editingTxId: null,
    targetCatId: null, editingDivId: null, viewingDivId: null,
  });

  const modPj = (fn: (p: Project) => Project) => update({
    workspaces: S.workspaces.map(w =>
      w.id === S.selectedWorkspaceId
        ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? fn(p) : p) }
        : w
    ),
  });

  const shared: SharedProps = { S, update, ws, pj, closeModal, modPj };

  if (isMobile) return <MobileApp {...shared} />;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'SaoChingcha', sans-serif", overflow: 'hidden', background: C.paper }}>
      <Sidebar {...shared} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {S.view === 'dashboard' && <DashboardView {...shared} />}
        {S.view === 'projects' && <ProjectsView {...shared} />}
        {S.view === 'project-detail' && <ProjectDetailView {...shared} />}
      </div>
      <Modals {...shared} />
    </div>
  );
}
